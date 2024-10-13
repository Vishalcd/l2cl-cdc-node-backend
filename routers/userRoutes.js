import express from 'express';
import {
  forgotPassword,
  login,
  logout,
  protect,
  resetPassword,
  restrictTo,
  signup,
  updatePassword,
} from '../controllers/authController.js';
import {
  getMe,
  getUser,
  updateMe,
  deleteMe,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  uploadUserPhoto,
  resizeUserPhoto,
} from '../controllers/userController.js';
import transactionRouter from './transactionRoutes.js';

const router = express.Router();

router.post('/signup/student', signup);
router.post('/signup/employee', signup);
router.post('/login', login);
router.post('/logout', logout);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// // Protect all routes after this middleware
router.use(protect);

router.get('/me', getMe, getUser);
router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);
router.post('/deleteMe', deleteMe);
router.patch('/updateMyPassword', updatePassword);

// Admin Access only routes
router.use(protect, restrictTo('admin'));

router.use('/:userId/transactions', transactionRouter);
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
