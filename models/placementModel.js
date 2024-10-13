import mongoose from 'mongoose';

const placementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us name. Name is required!'],
    trim: true,
    minLength: 2,
    maxLength: 20,
  },
  gender: {
    type: String,
    default: 'male',
    required: [true, 'Please tell us gender. Gender is required!'],
    trim: true,
  },
  photo: {
    type: String,
  },
  salary: {
    type: Number,
    required: [true, 'Please tell us salary. Salary is required!'],
  },
  companyName: {
    type: String,
    required: [true, 'Please tell us company name. Company name is required!'],
  },
  developerRole: {
    type: String,
    required: [true, 'Please tell us developer role. Developer role is required!'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Placement = mongoose.model('Placements', placementSchema);
export default Placement;
