import express from 'express';
import { createCourse, deleteCourse, getAllCourses, getCourse, updateCourse } from '../controllers/courseController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

// Admin Access only routes
router.route('/').get(getAllCourses).post(protect, restrictTo('admin'), createCourse);
router
  .route('/:id')
  .get(getCourse)
  .patch(protect, restrictTo('admin'), updateCourse)
  .delete(protect, restrictTo('admin'), deleteCourse);

export default router;
