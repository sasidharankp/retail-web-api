import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import userModel from '../models/userSchema.js';
import cartModel from '../models/cartSchema.js';

export function getAllUsers(req, res) {
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;

	userModel.find()
		.select(['-_id','-__v'])
		.limit(limit)
		.sort({userId: sort})
		.then(result => {
			res.json(result);
		})
		.catch((error) => res.status(500).json({ message: error.message }));
}

export function getUser(req, res) {
	if (req.params.id == null || !mongoose.Types.ObjectId.isValid(req.params.id)) {
		res.json({
			message: 'Please Check the User ID',
		});
	}else{
		const id = req.params.id;
		userModel.findOne({userId:id})
			.select(['-_id','-__v'])
			.then((result) => {
				if (!result) {
					res.status(404).json({
						status: 'error',
						message: 'User Not Found',
						userId: `${id}`
					});
				}else{
					res.status(200).json(result);
				}
			})
			.catch((error) => res.status(404).json({ message: error.message }));
	}
}

export function addUser(req, res) {
	if (typeof req.body == undefined) {
		res.json({
			status: 'error',
			message: 'data is undefined',
		});
	} else {
		const uniqueId=mongoose.Types.ObjectId();
		const userinfo = new userModel({
			_id: uniqueId,
			userId: uniqueId,
			email:req.body.email,
			username:req.body.username,
			password:bcrypt.hashSync(req.body.password, 5),
			name:{
				firstname:req.body.name.firstname,
				lastname:req.body.name.lastname
			},
			address:{
				city:req.body.address.city,
				street:req.body.address.street,
				number:req.body.address.number,
				zipcode:req.body.address.zipcode,
				geolocation: {
					lat:req.body.address.geolocation.lat,
					long:req.body.address.geolocation.long
				}
			},
			phone:req.body.phone
		});
	
		userinfo.save()
			.then(() => {
			})
			.then(() => {
				const cartInfo =new cartModel({
					_id:uniqueId,
					cartId:uniqueId,
					user:uniqueId,
					products:[]
				});
				cartInfo.save()
					.then(result => res.status(200).json(result))
					.catch((error) => res.status(500).json({ message: error.message }));
			})
			.catch(error => {if(error.code==11000){
				const errorKey=error.keyValue;
				res.status(500).json({ message: `User with ${Object.keys(errorKey)} : ${Object.values(errorKey)}  Already Exists!`});
			}else{
				res.status(500).json({ message: error.message });
			}});

	}
}

export function editUser(req, res) {
	const id = req.params.id;
	if (typeof req.body == undefined || id == null) {
		res.json({
			status: 'error',
			message: 'Re check user data',
		});
	} 
	const userInfo= {
		email:req.body.email,
		username:req.body.username,
		password:bcrypt.hashSync(req.body.password, 5),
		name:{
			firstname:req.body.name.firstname,
			lastname:req.body.name.lastname
		},
		address:{
			city:req.body.address.city,
			street:req.body.address.street,
			number:req.body.address.number,
			zipcode:req.body.address.zipcode,
			geolocation:{
				lat:req.body.address.geolocation.lat,
				long:req.body.address.geolocation.long
			}
		},
		phone:req.body.phone
	};

	userModel.findOneAndUpdate({userId:id}, userInfo, {new: true})
		.select(['-_id','-__v','-password'])
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((error) => res.status(500).json({ message: error.message }));

}

export const deleteUser = (req, res) => {
	if (req.params.id == null || !mongoose.Types.ObjectId.isValid(req.params.id)) {
		res.json({
			message: 'Please Check the User ID',
		});
	} else {
		userModel.findOneAndDelete({userId: req.params.id})
			.select(['-_id','-__v', '-password'])
			.then((result) => {
				if(!result){
					res.status(404).json(
						{ 
							error: `Unable to find any user with Id: ${req.params.id}`
						});
				}
			})
			.then(() => {
				cartModel.findOneAndDelete({cartId: req.params.id})
					.select('user -_id')
					.then(result => {
						const message= (result)? `Successfully Deleted User : ${result.user}`:'Successfully Deleted User';
						res.status(200).json({ message: message});
					})
					.catch((error) => res.status(500).json({ message: error.message }));
			})
			.catch((error) => res.status(404).json({ message: error.message }));
	}
};