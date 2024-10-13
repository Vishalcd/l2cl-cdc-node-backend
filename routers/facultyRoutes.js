import express from 'express';
import {
  createFaculty,
  deleteFaculty,
  getAllFaculty,
  getFaculty,
  resizeFacultyPhoto,
  updateFaculty,
  uploadFacultyPhoto,
} from '../controllers/facultyController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router
  .route('/')
  .get(getAllFaculty)
  .post(protect, restrictTo('admin'), uploadFacultyPhoto, resizeFacultyPhoto, createFaculty);
router
  .route('/:id')
  .get(getFaculty)
  .patch(protect, restrictTo('admin'), uploadFacultyPhoto, resizeFacultyPhoto, updateFaculty)
  .delete(protect, restrictTo('admin'), deleteFaculty);

export default router;
