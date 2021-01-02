import cartModel from '../models/cartSchema.js';

export function getAllCarts(req,res) {
	const limit = Number(req.query.limit) || 0;
	const sort = (req.query.sort == 'desc') ? -1 : (req.query.sort == 'asc') ? 1 : 1 ;
    
	cartModel.find()
		.select('-_id -products._id -__v -cartId')
		.limit(limit)
		.sort({id:sort})
		.then(result=>{
			res.status(200).json(result);
		})
		.catch((error) => res.status(404).json({ message: error.message }));
}

export function getCartbyUserid(req,res) {
	const id = req.params.id;
	cartModel.findOne({userId:id})
		.select('-_id -products._id -__v -cartId')
		.then(result=>{
			if (!result) {
				res.status(404).json({
					status: 'error',
					message: 'No cart Found for User',
					userId: `${id}`
				});
			}else{
				res.status(200).json(result);
			}
		})
		.catch((error) => res.status(500).json({ message: error.message }));
}

export function updateCart(req,res) {
	const id = req.body.userId;
	const options ={ upsert: true, new: true, setDefaultsOnInsert: true };
	if (typeof req.body == undefined || id == null) {
		res.json({
			status: 'error',
			message: 'Re-check your product data',
		});
	} 
	const cartInfo= {
		cartId: id,
		userId: id,
		products:req.body.products
	};
	cartModel.findOneAndUpdate({userId:id}, cartInfo, options)
		.select('-_id -products._id -__v')
		.then((result) => res.status(200).json(result))
		.catch((error) => res.status(500).json({ message: error.message }));
}

export function deleteCart(req, res) {
	const id = req.params.id;
	if (id == null) {
		res.json({
			status: 'error',
			message: 'cart id should be provided'
		});
	} else {
		cartModel.findOneAndDelete({userId:id})
			.select('-_id -products._id')
			.then(result=> res.status(200).json(result))
			.catch((error) => res.status(500).json({ message: error.message }));
	}
}