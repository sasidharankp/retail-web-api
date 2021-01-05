import mongoose from 'mongoose';
import orderModel from '../models/orderSchema.js';

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
	if (typeof req.body == undefined) {
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

		orderInfo.save()
			.then(result => res.status(200).json(result))
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
		orderModel.findOneAndDelete({orderId:id})
			.select('-_id -products._id')
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
			.select('-_id -products._id')
			.then(result=> res.status(200).json(result))
			.catch((error) => res.status(500).json({ message: error.message }));
	}
}