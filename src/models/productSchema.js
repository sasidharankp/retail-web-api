import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = Schema({
	_id:{
		type:Schema.Types.ObjectId,
		immutable:true
	},
	productId:{
		type:Schema.Types.ObjectId,
		immutable:true,
		unique:true
	},
	stock:{
		type:Number,
		required:true
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