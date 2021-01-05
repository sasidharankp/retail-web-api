import mongoose from 'mongoose';
const { Schema } = mongoose;

const orderSchema = new Schema({
	_id:{
		type:Schema.Types.ObjectId,
		immutable:true
	},
	orderId:{
		type:Schema.Types.ObjectId,
		immutable:true,
		unique:true,
		required:true
	},
	orderInfo:{
		type:Schema.Types.ObjectId,
		ref:'cart',
		required:true
	},
	userInfo:{
		type:Schema.Types.ObjectId,
		ref:'user',
		required:true
	},
	orderStatus: {
		type: String,
		enum: ['payment pending','confirmed', 'shipped', 'delivered', 'cancelled'],
		required:true,
		default:'confirmed'
	}
},
{ 
	timestamps: true 
}
);

const orderModel = mongoose.model('order', orderSchema);

export default orderModel ;