import express from 'express';
import { getAllOrders, getOrdersByStatus, getOrderByOrderId, placeOrder, updateOrderStatus, cancelOrder, deleteOrder } from '../controllers/order.js';

const router = express.Router();


router.get('/',getAllOrders);
router.get('/status', getOrdersByStatus);
router.get('/:id',getOrderByOrderId);
router.post('/',placeOrder);
router.post('/cancel/:id',cancelOrder);
router.put('/status/:id',updateOrderStatus);
router.delete('/:id',deleteOrder);

export default router;