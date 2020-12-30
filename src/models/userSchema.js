import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
	userId:{
		type:Number,
		required:true,
		immutable:true,
		unique:true
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
		required:true
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
	phone:String
});

const userModel = mongoose.model('user', userSchema);

export default userModel;