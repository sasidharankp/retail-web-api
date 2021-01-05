import express from 'express';
import { getAllProducts, getAllCategories, getProductsByCategory, getProductById, addProduct, editProduct, deleteProduct, bulkAdd, deleteAllProducts} from '../controllers/product.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/categories', getAllCategories);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);
router.post('/', addProduct);
router.post('/bulk', bulkAdd);
router.put('/:id', editProduct);
router.delete('/:id', deleteProduct);
router.delete('/clear/all', deleteAllProducts);

export default router;
