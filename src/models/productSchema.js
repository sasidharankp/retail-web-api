import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = Schema({
	productId:{
		type:Number,
		required:true,
		unique:true
	},
	name: {
		type:String,
		required:true
	},
	price:{
		type:Number,
		required:true
	},
	description: String,
	category:String,
	image: String
});

const productModel = mongoose.model('product', productSchema);

export default productModel;