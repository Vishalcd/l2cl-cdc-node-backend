import mongoose from 'mongoose';
import slugify from 'slugify';

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    trim: true,
    required: [true, 'Course Name is required'],
    unique: true,
  },
  coursePrice: {
    type: Number,
    trim: true,
    required: [true, 'Course Name is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

courseSchema.pre('save', function (next) {
  this.courseName = slugify(this.courseName);
  next();
});

const Course = mongoose.model('Courses', courseSchema);
export default Course;
