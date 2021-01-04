import express from 'express';
import { getAllCarts,  getCartbyId, updateCart, clearCart, createCart} from '../controllers/cart.js';

const router = express.Router();


router.get('/',getAllCarts);
router.get('/:id',getCartbyId);
router.post('/:id',createCart);
router.put('/:id',updateCart);
router.delete('/:id',clearCart);

export default router;