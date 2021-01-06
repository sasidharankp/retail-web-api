import _ from 'lodash';

import cartModel from '../models/cartSchema.js';
import mongoose from 'mongoose';
import productModel from '../models/productSchema.js';

export function getAllCarts(req,res) {
	const limit = Number(req.query.limit) || 0;
	const sort = (req.query.sort == 'desc') ? -1 : (req.query.sort == 'asc') ? 1 : 1 ;
    
	cartModel.find()
		.select('-_id -products._id -__v -createdAt -user')
		.limit(limit)
		.sort({id:sort})
		.then(result=>{
			res.status(200).json(result);
		})
		.catch((error) => res.status(404).json({ message: error.message }));
}

export function getCartbyId(req,res) {
	const id = req.params.id;
	if(!mongoose.Types.ObjectId.isValid(id)){
		res.status(500).json({ message: 'Invalid Cart Id' });
	}else{
		cartModel.findOne({cartId:id})
			.select('-_id -products._id -__v')
			.populate('user','name email username phone address.city -_id')
			.populate('products.productId','productId name price description image -_id')
			.then((result) => {
				result.products = result.products.filter(x => x.productId);
				const newCartTotal=result.products.map(y => (y.quantity*y.productId.price)).reduce((a, c) => a + c);
				if(newCartTotal!=result.cartTotal){
					cartModel.findOneAndUpdate({cartId:id}, {'cartTotal': newCartTotal}, {new: true})
						.select('-_id -products._id -__v')
						.populate('user','name email username phone address.city -_id')
						.populate('products.productId','productId name price description image -_id')
						.then((result) => {
							result.products = result.products.filter(x => x.productId);
							res.status(200).json(result);
						})
						.catch((error) => res.status(500).json({ message: error.message }));
				}else{
					res.status(200).json(result);
				}
			})
			.catch((error) => res.status(500).json({ message: error.message }));
	}
}

export function createCart(req,res) {
	const id = req.params.id;
	if (req.params.id == null || !mongoose.Types.ObjectId.isValid(req.params.id)) {
		res.json({
			message: 'Please Check the User ID',
		});
	}else{
		const cartInfo =new cartModel({
			_id:mongoose.Types.ObjectId(),
			cartId:id,
			user:id,
			products:[]
		});
		cartInfo.save()
			.then(result => res.status(200).json(result))
			.catch(error => {if(error.code==11000){
				const errorKey=error.keyValue;
				res.status(500).json({ message: `User with ${Object.keys(errorKey)} : ${Object.values(errorKey)}  Already Exists!`});
			}else{
				res.status(500).json({ message: error.message });
			}});
	}
}

export function updateCart(req,res) {
	const cartId = req.params.id;
	const options ={ upsert: true, new: true, setDefaultsOnInsert: true };
	if (typeof req.body == undefined || !mongoose.Types.ObjectId.isValid(cartId)) {
		res.json({
			status: 'error',
			message: 'Re-check your product data',
		});
	}

	const productsList=req.body.products.map(product => {
		if(product.quantity>0){
			return product.productId;
		}
	}).filter(id => mongoose.Types.ObjectId.isValid(id));
	if(productsList.length){
		productModel.find({'productId': { $in: productsList}})
			.select('price productId -_id')
			.then((result) => {
				var validProducts=result.map(product => {
					return {
						productId:String(product.productId),
						price:product.price
					};
				});
				var userCart=req.body.products;
				
				var cartInfo = _.map(validProducts, function(item) {
					return _.merge(item, _.find(userCart, { 'productId' : item.productId }));
				});

				const cartTotal = cartInfo.map(x => (x.quantity*x.price)).reduce((a, c) => a + c);

				if (cartInfo.length) {
					const query={ '$set': { 'products': cartInfo, 'cartTotal': cartTotal}};
					cartModel.findOneAndUpdate({cartId:cartId}, query, options)
						.select('-_id -products._id -__v -createdAt')
						.populate('products.productId','name price -_id')
						.then((result) => res.status(200).json(result))
						.catch((error) => res.status(404).json({ message: error.message }));
				}else{
					res.status(404).json({
						status: 'error',
						message: 'products Not Found'
					});
				}

			})
			.catch((error) => res.status(404).json({ message: error.message }));
	}else{
		res.status(404).json({ error: 'Check Cart Data', data:req.body });
	}
		
}

export function deleteCart(req, res) {
	const id = req.params.id;
	if (id == null) {
		res.json({
			status: 'error',
			message: 'cart id should be provided'
		});
	} else {
		cartModel.findOneAndDelete({cartId:id})
			.select('-_id -products._id')
			.then(result=> res.status(200).json(result))
			.catch((error) => res.status(500).json({ message: error.message }));
	}
}

export function clearCart(req, res) {
	const id = req.params.id;
	if (id == null) {
		res.json({
			status: 'error',
			message: 'cart id should be provided'
		});
	} else {
		const options ={ upsert: true, new: true};
		const query={ '$set': { 'products': [], 'cartTotal': 0}};
		cartModel.findOneAndUpdate({cartId:id},query,options)
			.select('-_id -products._id')
			.then(result=> res.status(200).json(result))
			.catch((error) => res.status(500).json({ message: error.message }));
	}
}