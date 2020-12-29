import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = Schema({
	name: String,
	description: String,
	image: String,
	price: Number,
});

const productModel = mongoose.model('product', productSchema);

export default productModel;
