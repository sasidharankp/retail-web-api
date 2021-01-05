import mongoose from 'mongoose';
const { Schema } = mongoose;

const cartSchema = new Schema({
	_id:{
		type:Schema.Types.ObjectId,
		immutable:true
	},
	cartId:{
		type:Schema.Types.ObjectId,
		immutable:true,
		unique:true
	},
	user:{
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	products:[
		{
			productId:{
				type:Schema.Types.ObjectId,
				ref:'product',
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

export default cartModel;