import express from 'express';
import { getAllCarts,  getCartbyId, updateCart, clearCart, createCart, deleteCart} from '../controllers/cart.js';

const router = express.Router();


router.get('/',getAllCarts);
router.get('/:id',getCartbyId);
router.post('/:id',createCart);
router.put('/:id',updateCart);
router.post('/clear/:id',clearCart);
router.delete('/:id',deleteCart);

export default router;