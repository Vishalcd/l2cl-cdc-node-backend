import express from 'express';
import { createTransaction, getAllTransactions } from '../controllers/transactionController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router({ mergeParams: true });

// admin only routes
router.use(protect, restrictTo('admin'));
router.route('/').get(getAllTransactions).post(createTransaction);

export default router;
