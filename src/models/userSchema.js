import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
	_id:{
		type:Schema.Types.ObjectId,
		immutable:true
	},
	userId:{
		type:Schema.Types.ObjectId,
		immutable:true,
		required:true
	},
	email:{
		type:String,
		lowercase: true,
		required:true,
		unique:true
	},
	username:{
		type:String,
		lowercase: true,
		required:true
	},
	password:{
		type:String,
		required:true,
		select: false
	},
	name:{
		firstname:{
			type:String,
			required:true
		},
		lastname:{
			type:String,
			required:true
		}
	},
	address:{
		city:String,
		street:String,
		number:Number,
		zipcode:String,
		geolocation:{
			lat:String,
			long:String
		}
	},
	phone:{
		type:String
	},
	orders:[
		{
			type:Schema.Types.ObjectId,
			ref:'order',
		}
	]
});

const userModel = mongoose.model('user', userSchema);

export default userModel;