// External Dependencies


// Global Config

import { Router } from 'express';
import {
  signUpController,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController';


const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', signUpController);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;

