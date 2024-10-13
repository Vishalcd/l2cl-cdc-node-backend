import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { createOne, getAll, updateOne } from './handleFactory.js';
import { uploadImage } from '../middlewares/uploadMiddleware.js';
import sharp from 'sharp';
import Transaction from '../models/transactionModel.js';

// user photo upload middleware
export const uploadUserPhoto = uploadImage.single('photo');

export const resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${Date.now()}-${req.user._id}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 80 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

const filterObj = (obj, ...allowedFields) => {
  // newObj
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMe = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// get me
export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  // check if user is student only
  if (user.role !== 'student') {
    return next(new AppError('No Student found with this id', 404));
  }

  const allTransactions = await Transaction.find({ userId: user._id });

  if (!allTransactions) {
    user.remainingFees = user.totalFees;
  }

  const allDepositAmount = allTransactions.reduce((acc, transaction) => acc + transaction.transactionAmount, 0);
  user.remainingFees = user.totalFees - allDepositAmount;

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, { active: false }, { upsert: true });

  if (!user) {
    return next(new AppError('Something went wrong', 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});

export const getAllUsers = getAll(User, { role: 'student' });
export const createUser = createOne(User);

// Don't Update Password from this handler
export const updateUser = updateOne(User);
