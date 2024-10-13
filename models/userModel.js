import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import Course from './courseModel.js';

const userSchema = new mongoose.Schema(
  {
    enrollId: {
      type: String,
    },
    name: {
      type: String,
      required: [true, 'Please tell us your name.'],
      trim: true,
      minLength: 2,
      maxLength: 20,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      default: 'male',
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please Provide your email.'],
    },
    phoneNumber: {
      type: String,
      unique: true,
      trim: true,
      validate: [validator.isMobilePhone, 'Please Provide your Correct number.'],
    },
    courses: [
      {
        required: [true, 'Please select at least one course.'],
        type: mongoose.Schema.ObjectId,
        ref: 'Courses',
      },
    ],
    totalFees: {
      type: Number,
    },
    remainingFees: { type: Number },

    fatherName: {
      type: String,
    },
    fatherPhoneNumber: {
      type: String,
      unique: true,
      trim: true,
      validate: [validator.isMobilePhone, 'Please Provide your father correct number.'],
    },
    savedNotes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Notes',
      },
    ],
    photo: {
      type: String,
      default: 'default.jpg',
    },
    role: {
      type: String,
      enum: ['student', 'employee', 'admin'],
      default: 'student',
    },
    password: {
      type: String,
      required: [true, 'Please provide a password.'],
      trim: true,
      minLength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password.'],
      validate: {
        validator: function (val) {
          return this.password === val;
        },
        message: 'Passwords are not same.',
      },
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
    active: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: {
      virtuals: true,
    },
  }
);

// VIRTUAL Properties
userSchema.virtual('feesComplete').get(function () {
  return this.remainingFees === 0;
});

userSchema.pre('save', async function (next) {
  if (this.role === 'employee') {
    this.totalFees = undefined;
    this.savedNotes = undefined;
    this.courses = undefined;

    next();
  }

  // for students only
  this.courses = await Course.find({ _id: { $in: this.courses } });
  this.totalFees = this.courses.reduce((acc, course) => acc + course.coursePrice, 0);
  this.remainingFees = this.totalFees;

  next();
});

userSchema.pre('save', async function (next) {
  // if password is not modified
  if (!this.isModified('password')) return next();

  // if password is modified
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm Field
  this.passwordConfirm = undefined;
});

// Set password changed timestamp after password is changed
userSchema.pre('save', function (next) {
  if (!this.isModified || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'courses',
  });
  next();
});

// check candidate password is correct
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// check did user change password after token issued
userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return changedTimestamp > jwtTimestamp;
  }

  return false;
};

// createPasswordResetToken
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('Users', userSchema);
export default User;
