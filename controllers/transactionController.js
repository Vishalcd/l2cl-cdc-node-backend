import { v4 as uuid } from 'uuid';
import Transaction from '../models/transactionModel.js';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import Email from '../utils/email.mjs';

export const createTransaction = catchAsync(async (req, res, next) => {
  const { transactionAmount } = req.body;

  const allTransactions = await Transaction.find({ userId: req.params.userId });
  const user = await User.findById(req.params.userId);

  const depositedFee = allTransactions.reduce((acc, transaction) => transaction.transactionAmount + acc, 0) || 0;

  const remainingFees = user.totalFees - depositedFee;

  if (transactionAmount <= 0 || remainingFees < transactionAmount) {
    return next(new AppError('Fee amount is not valid.', 400));
  }

  // CREATE NEW TRANSACTION
  req.body.transactionId = uuid().split('-')[0];
  req.body.remainingFees = remainingFees - transactionAmount;
  req.body.userId = req.params.userId;
  const transaction = await Transaction.create(req.body);

  // SEND EMAIL TO USER
  await new Email(user, '', transaction).sendFeeDeposit();

  res.status(200).json({
    status: 'success',
    data: transaction,
  });
});

export const getAllTransactions = catchAsync(async (req, res) => {
  const allUserTransactions = await Transaction.find({ userId: req.params.userId }).sort({ _id: -1 }).populate({
    path: 'courses',
    select: 'courseName',
  });

  res.status(200).json({
    status: 'success',
    results: allUserTransactions.length,
    data: {
      data: allUserTransactions,
    },
  });
});
