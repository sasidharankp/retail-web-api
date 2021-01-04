import cartModel from '../models/cartSchema.js';
import mongoose from 'mongoose';

export function getAllCarts(req,res) {
	const limit = Number(req.query.limit) || 0;
	const sort = (req.query.sort == 'desc') ? -1 : (req.query.sort == 'asc') ? 1 : 1 ;
    
	cartModel.find()
		.populate('user')
		.select('-_id -products._id -__v')
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
			.populate('user')
			.then((result) => res.status(200).json(result))
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
			.catch((error) => res.status(500).json({ message: error.message }));
	}
}

export function updateCart(req,res) {
	const id = req.params.id;
	const options ={ upsert: true, new: true, setDefaultsOnInsert: true };
	if (typeof req.body == undefined || id == null) {
		res.json({
			status: 'error',
			message: 'Re-check your product data',
		});
	} 
	const cartInfo= {
		products:req.body.products
	};
	cartModel.findOneAndUpdate({cartId:id}, cartInfo, options)
		.select('-_id -products._id -__v')
		.then((result) => res.status(200).json(result))
		.catch((error) => res.status(500).json({ message: error.message }));
}

export function clearCart(req, res) {
	const id = req.params.id;
	if (id == null) {
		res.json({
			status: 'error',
			message: 'cart id should be provided'
		});
	} else {
		cartModel.findOneAndUpdate({cartId:id},{products:[]})
			.select('-_id -products._id')
			.then(result=> res.status(200).json(result))
			.catch((error) => res.status(500).json({ message: error.message }));
	}
}