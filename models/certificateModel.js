import mongoose from 'mongoose';
import AppError from '../utils/appError.js';

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
  },
  name: {
    type: String,
    required: [true, 'Please tell us name. Name is required!'],
    trim: true,
    minLength: 2,
    maxLength: 20,
  },
  fatherName: {
    type: String,
    trim: true,
    minLength: 2,
    maxLength: 20,
    required: [true, 'Please tell us Fathername. Father Name is required!'],
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    default: 'male',
    required: [true, 'Please tell us gender. Gender is required!'],
    trim: true,
  },
  certificate: {
    type: String,
    required: [true, 'Please Provide certificate. Certificate is required!'],
    trim: true,
  },
  certificateType: {
    type: String,
    default: 'certificate',
    enum: ['certificate', 'work-experience'],
  },
  experience: {
    type: Number,
  },
  course: {
    type: String,
    required: [true, 'Please tell us about course. Course is required!'],
  },
  downloadPermission: {
    type: String,
    default: 'false',
    enum: ['true', 'false'],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide start date. startDate is required!'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide end date. endDate is required!'],
  },
});

certificateSchema.pre('save', function (next) {
  function yearsBetweenDates(startDateStr, endDateStr) {
    // Convert ISO strings to Date objects
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Calculate the year difference
    let years = endDate.getFullYear() - startDate.getFullYear();

    // Adjust if the end date is before the start date's month and day
    const isBefore =
      endDate.getMonth() < startDate.getMonth() ||
      (endDate.getMonth() === startDate.getMonth() && endDate.getDate() < startDate.getDate());

    // Subtract one year if the end date is earlier in the year
    if (isBefore) {
      years -= 1;
    }

    // send error if year is less then 1 year
    if (years <= 0) {
      return next(new AppError('Please provide valid dates experience can not be 0!', 400));
    }

    return years;
  }

  this.experience = yearsBetweenDates(this.startDate, this.endDate);

  next();
});

const Certificate = mongoose.model('Certificates', certificateSchema);
export default Certificate;
