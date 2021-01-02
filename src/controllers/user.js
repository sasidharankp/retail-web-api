import userModel from '../models/userSchema.js';

export function getAllUsers(req, res) {
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;

	userModel.find()
		.select(['-_id','-__v', '-password'])
		.limit(limit)
		.sort({userId: sort})
		.then(result => {
			res.json(result);
		})
		.catch(error => console.log(error));
}

export function getUser(req, res) {
	const id = req.params.id;
	userModel.findOne({userId:id})
		.select(['-_id','-__v', '-password'])
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

export function addUser(req, res) {
	if (typeof req.body == undefined) {
		res.json({
			status: 'error',
			message: 'data is undefined',
		});
	} else {

		let userCount = 0;
		userModel.find().countDocuments(function (error, count) {
			userCount = count;
		})
			.then(() => {
				const userinfo = new userModel({
					userId: userCount + 1,
					email:req.body.email,
					username:req.body.username,
					password:req.body.password,
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
					.then(result => res.status(200).json(result))
					.catch(error => console.log(error));
			});
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
		userId: req.params.id,
		email:req.body.email,
		username:req.body.username,
		password:req.body.password,
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
			res.json(result);
		})
		.catch((error) => res.status(500).json({ message: error.message }));

}

export const deleteUser = (req, res) => {
	if (req.params.id == null) {
		res.json({
			status: 'error',
			message: 'User ID cant be empty',
		});
	} else {
		userModel.findOneAndDelete({userId: req.params.id})
			.select(['-_id','-__v', '-password'])
			.then((result) => {
				if(!result){
					res.status(404).json({ message: 'User Not Found' });
				}else{
					res.status(200).json(result);
				}
			})
			.catch((error) => res.status(404).json({ message: error.message }));
	}
};