import express from 'express';
import mongoose from 'mongoose';

import productModel from '../models/productSchema.js';

const router = express.Router();

export const getAllProducts = async (req, res) => {
	try {
		const result = await productModel.find();

		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const getProductById = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ message: `Invalid product id: ${id}` });
	}
	try {
		const result = await productModel.findById(id);

		if (!result) {
			res.
				status(404).
				json(
					{
						error: { message: 'Product Not Found' },
						productId: `${id}`
					}

				);
		}
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export default router;
