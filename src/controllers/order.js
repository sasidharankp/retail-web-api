import mongoose from 'mongoose';
import cartModel from '../models/cartSchema.js';
import orderModel from '../models/orderSchema.js';
import productModel from '../models/productSchema.js';
import userModel from '../models/userSchema.js';

export const getAllOrders = (req, res) => {
	orderModel.find()
		.select(['-_id','-__v'])
		.then((result) => res.status(200).json(result))
		.catch((error) => res.status(404).json({ message: error.message }));
};

export const getOrdersByStatus = (req,res) => {
	const allAvailableStatus = ['confirmed', 'shipped', 'delivered', 'cancelled'];
	if (!allAvailableStatus.includes(req.query.status)) {
		res.json({
			message: `Invalid Status. These are the Allowed options ${allAvailableStatus}`,
		});
	}else{
		const status = req.query.status;
		const limit = Number(req.query.limit) || 0;
		orderModel.distinct('orderStatus')
			.find({ orderStatus:status })
			.select('orderId orderStatus updatedAt -_id')
			.limit(limit)
			.then((result) => {
				if(!result.length){
					res.status(404).json({ message: 'No Orders Found' });
				}else{res.status(200).json(result);
				}
			})
			.catch((error) => res.status(404).json({ message: error.message }));
	}
};

export const getOrderByOrderId = (req, res) => {
	if (req.params.id == null || !mongoose.Types.ObjectId.isValid(req.params.id)) {
		res.json({
			message: 'Please Check the User ID',
		});
	}else{
		const id = req.params.id;
		orderModel.findOne({orderId:id})
			.select('-_id -__v -createdAt')
			// .populate({
			// 	path: 'orderInfo',select:'products, -_id',
			// 	populate: ({
			// 		path: 'products.productId', select:'productId name price description image -_id'
			// 	}),
			// })
			.populate('userInfo','name address phone -_id')
			.then((result) => {
				if (!result) {
					res.status(404).json({
						status: 'error',
						message: 'Order Not Found',
						orderId: `${id}`
					});
				}else{
					res.status(200).json(result);
				}
			})
			.catch((error) => res.status(404).json({ message: error.message }));
	}
};

export const placeOrder = (req, res) => {
	const options ={ upsert: true, new: true, setDefaultsOnInsert: true };
	if (typeof req.body == undefined || !mongoose.Types.ObjectId.isValid(req.body.userId)) {
		res.json({
			status: 'error',
			message: 'Invalid Order Data',
		});
	} else {
		const uniqueId = mongoose.Types.ObjectId();
		const userId = req.body.userId;
		const orderInfo = new orderModel({
			_id: uniqueId,
			orderId: uniqueId,
			userInfo:userId,
			orderInfo:userId
			
		});

		userModel.exists({userId:userId})
			.then((result)=>{
				
				if(result){
					cartModel.findOne({cartId:userId})
						.select('-_id -products._id -createdAt -updatedAt -__v')
						.populate('products.productId','productId price stock -_id')
						.then((result) => {
							let quantity;
							let cartAdjusted=false;
							let updatedCart=result.products.map(product => {
								if(product.quantity>  product.productId.stock){
									quantity =product.productId.stock;
									cartAdjusted=true;
								}else{
									quantity =product.quantity;
									cartAdjusted=false;
								}
								return({
									productId:product.productId.productId,
									quantity:quantity, 
									price:product.productId.price,
									stock:product.productId.stock
								});
							});
							const cartTotal = (updatedCart.length)?updatedCart.map(x => (x.quantity*x.price)).reduce((a, c) => a + c):0;
							const query={ '$set': { 'products': updatedCart, 'cartTotal': cartTotal}};
							if(cartAdjusted==true){
								cartModel.findOneAndUpdate({cartId:userId}, query, options)
									.select('-_id -products._id -__v -createdAt')
									.populate('products.productId','name price -_id')
									.then((result) => {
										res.status(200).json({
											message:'Your cart has been adjusted based on availabilty. Please Validate and Proceed',
											updatedCart:result
										});
									})
									.catch((error) => res.status(404).json({ message: error.message }));
							}else{
								updatedCart.forEach(i => {
									productModel.findByIdAndUpdate(i.productId,{ $set: { stock: i.stock-i.quantity }})
										.then(() => {});
								});
								orderInfo.save()
									.then(orderResult => {
										userModel.findByIdAndUpdate(
											userId, 
											{ $push: { orders: orderResult } },
											{ new: true}
										).then((result) => {		
											if(result){
												res.status(200).json({
													orderId:orderResult.orderId,
													status:orderResult.orderStatus,
												});}
										}).then(()=>clearCart(userId));
									});
							}
							
						});
					

					
				}else{
					res.status(200).json({
						message:'User Does Not Exist!'
					});
				}
			})
			.catch((error) => res.status(500).json({ message: error.message }));
	}
};

export function updateOrderStatus(req, res) {
	const allAvailableStatus = ['payment pending', 'confirmed', 'shipped', 'delivered'];
	if (!mongoose.Types.ObjectId.isValid(req.params.id)|| !allAvailableStatus.includes(req.query.status)) {
		res.json({
			message: 'Invalid Order ID or Status',
		});
	}else{
		const options ={ upsert: true, new: true, setDefaultsOnInsert: true };
		const status = req.query.status;
		const orderId = req.params.id;
		orderModel.findOneAndUpdate({orderId:orderId}, {orderStatus:status}, options)
			.select('-_id -__v -createdAt')
			.populate({
				path: 'orderInfo',select:'products, -_id',
				populate: ({
					path: 'products.productId', select:'productId name price description image -_id'
				}),
			})
			.populate('userInfo','name address phone -_id')
			.then((result) => {
				if (!result) {
					res.status(404).json({
						status: 'error',
						message: 'Order Not Found',
						userId: `${orderId}`
					});
				}else{
					res.status(200).json(result);
				}
			})
			.catch((error) => res.status(404).json({ message: error.message }));
	}
}

export function cancelOrder(req, res) {
	const id = req.params.id;
	if (id == null) {
		res.json({
			status: 'error',
			message: 'Order ID should be provided'
		});
	} else {
		orderModel.findOneAndUpdate({orderId:id},{orderStatus:'cancelled'},{new:true})
			.select('orderStatus orderId updatedAt -_id')
			.then(result=> res.status(200).json(result))
			.catch((error) => res.status(500).json({ message: error.message }));
	}
}

export function deleteOrder(req, res) {
	const id = req.params.id;
	if (id == null) {
		res.json({
			status: 'error',
			message: 'Order ID should be provided'
		});
	} else {
		orderModel.findOneAndDelete({orderId:id})
			.select('-_id orderId')
			.then(result=> {
				const message= (result)? `Successfully Deleted Order with ID: ${result.orderId}`:`Unable to Find any Orders with ID: ${id}`;
				res.status(404).json(
					{ 
						message: message
					});
				res.status(200).json(result);})
			.catch((error) => res.status(500).json({ message: error.message }));
	}
}


function clearCart(cartId){
	const options ={ upsert: true, new: true};
	const query={ '$set': { 'products': [], 'cartTotal': 0}};
	cartModel.findOneAndUpdate({cartId:cartId},query,options)
		.select('-_id -products._id')
		.then(()=> console.log('cart cleared'))
		.catch((error) => console.log({ message: error.message }));
}