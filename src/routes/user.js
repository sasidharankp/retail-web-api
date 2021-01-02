import express from 'express';
import { getAllUsers, getUser, addUser, editUser, deleteUser } from '../controllers/user.js';

const router = express.Router();

router.get('/',getAllUsers);
router.get('/:id',getUser);
router.post('/',addUser);
router.put('/:id',editUser);
router.delete('/:id',deleteUser);

export default router;