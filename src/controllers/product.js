import mongoose from 'mongoose';

import productModel from '../models/productSchema.js';

export const getAllProducts = (req, res) => {
	const limit = Number(req.query.limit) || 0;
	const sortKey = (req.query.key == 'price') ? 'price' : (req.query.key == 'stock') ? 'stock' : 'productId' ;
	const sortOrder = (req.query.sort == 'desc') ? -1 : (req.query.sort == 'asc') ? 1 : 1 ;
	productModel.find()
		.select(['-_id','-__v'])
		.limit(limit)
		.sort({ [sortKey]: sortOrder })
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((error) => res.status(404).json({ message: error.message }));
};

export const getProductById = (req, res) => {
	const id = req.params.id;
	productModel.findOne({productId:id})
		.select('-_id -__v')
		.then((result) => {
			if (!result) {
				res.status(404).json({
					status: 'error',
					message: 'product Not Found',
					productId: `${id}`
				});
			}else{
				res.status(200).json(result);
			}
		})
		.catch((error) => res.status(404).json({ message: error.message }));
};

export const getAllCategories = (req,res) => {

	productModel.distinct('category')
		.then((result) => {
			if(!result.length){
				res.status(404).json({ message: 'No Categories Found' });
			}
			res.status(200).json(result);
		})
		.catch((error) => res.status(404).json({ message: error.message }));
};

export const getProductsByCategory = (req,res) => {
	const category = req.params.category;
	const limit = Number(req.query.limit) || 0;

	productModel.distinct('category')
		.find({
			category,
		})
		.limit(limit)
		.then((result) => {
			if(!result.length){
				res.status(404).json({ message: 'No Such Category' });
			}else{res.status(200).json(result);
			}
		})
		.catch((error) => res.status(404).json({ message: error.message }));
};

export const addProduct = (req, res) => {
	if (typeof req.body == undefined) {
		res.json({
			status: 'error',
			message: 'data is undefined',
		});
	} else {
		const uniqueId=mongoose.Types.ObjectId();
		const productInfo = new productModel({
			_id: uniqueId,
			productId: uniqueId,
			name: req.body.name,
			price: req.body.price,
			stock:req.body.stock,
			description: req.body.description,
			image: req.body.image,
			category: req.body.category,
		});
		productInfo.save()
			.then(result => res.status(200).json(result))
			.catch((error) => res.status(500).json({ message: error.message }));
	}
};

export const bulkAdd = (req, res) => {
	if (typeof req.body == undefined) {
		res.json({
			status: 'error',
			message: 'data is undefined',
		});
	} else {
		const products = req.body.map(product => {
			let uniqueId = mongoose.Types.ObjectId();
			Object.assign(product, {'productId':uniqueId});
			Object.assign(product, {'_id':uniqueId});
			return product;
		});
		productModel.insertMany(products)
			.then(result => res.status(200).json(result))
			.catch((error) => res.status(500).json({ message: error.message }));

	}
};
  
export const editProduct = (req, res) => {
	const id = req.params.id;
	if (typeof req.body == undefined || id == null) {
		res.json({
			status: 'error',
			message: 'Re check your product data',
		});
	} 
	const productInfo= {
		name: req.body.name,
		stock:req.body.stock,
		price: req.body.price,
		description: req.body.description,
		image: req.body.image,
		category: req.body.category,
	};
	productModel.findOneAndUpdate({productId:id}, productInfo, {new: true})
		.select('-_id -__v')
		.then((result) => {
			res.json(result);
		})
		.catch((error) => res.status(500).json({ message: error.message }));

};
  
export const deleteProduct = (req, res) => {
	const id = req.params.id;
	if (id == null) {
		res.json({
			status: 'error',
			message: 'product id cant be empty',
		});
	} else {
		productModel.findOneAndDelete({productId:id})
			.select('-_id -__v')
			.then((result) => {
				if(!result){
					res.status(404).json({ message: 'Product Not Found' });
				}else{
					res.status(200).json(result);
				}
			})
			.catch((error) => res.status(404).json({ message: error.message }));
	}
};

export const deleteAllProducts = (_req,res) =>{
	productModel.deleteMany({})
		.then((result) => res.status(200).json(result))
		.catch((error) => res.status(500).json({ message: error.message }));
};