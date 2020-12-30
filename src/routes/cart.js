import express from 'express';
import { getAllCarts, getCartbyUserid, updateCart, deleteCart } from '../controllers/cart.js';

const router = express.Router();


router.get('/',getAllCarts);
router.get('/:id',getCartbyUserid);
router.post('/',updateCart);
router.delete('/:id',deleteCart);

export default router;