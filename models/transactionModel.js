import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
  },
  transactionAmount: {
    type: Number,
    trim: true,
    required: [true, 'Transaction Amount is required'],
  },
  courses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Courses',
    },
  ],
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
  },
  transactionMethod: {
    type: String,
    enum: ['cash', 'online'],
    trim: true,
    required: [true, 'Transaction Method is required'],
  },
  remainingFees: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Transaction = mongoose.model('Transactions', transactionSchema);
export default Transaction;
