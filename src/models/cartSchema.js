import mongoose from 'mongoose';
const { Schema } = mongoose;

import productModel from './productSchema.js';
import userModel from './userSchema.js';

const cartSchema = new Schema({
	cartId:{
		type:Number,
		required:true,
		immutable:true,
		unique:true
	},
	userId:{
		type:Schema.Types.Number,
		ref:userModel,
		required:true
	},
	products:[
		{
			productId:{
				type:Schema.Types.Number,
				ref:productModel,
				required:true
			},
			quantity:{
				type:Number,
				required:true
			}
		}
	]
},
{ 
	timestamps: true 
}
);

const cartModel = mongoose.model('cart', cartSchema);

export default cartModel ;