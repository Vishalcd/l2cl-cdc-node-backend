import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us name. Name is required!'],
    trim: true,
    minLength: 2,
    maxLength: 20,
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Please provide description!'],
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    default: 'male',
    required: [true, 'Please tell us gender. Gender is required!'],
    trim: true,
  },
  photo: {
    type: String,
  },
  experience: {
    type: Number,
    trim: true,
    required: [true, 'Please tell us salary. Salary is required!'],
  },
  work: {
    type: String,
    required: [true, 'Please tell us about work. Work is required!'],
  },
  startDate: {
    type: Date,
    required: [true, 'Please tell us start date. startDate is required!'],
  },
});

const Faculty = mongoose.model('Facultys', facultySchema);
export default Faculty;
