import express from 'express';
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNote,
  resizePdfPhoto,
  updateNote,
  uploadPdfPhoto,
} from '../controllers/noteController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router.route('/').get(getAllNotes).post(protect, restrictTo('admin'), uploadPdfPhoto, resizePdfPhoto, createNote);
router
  .route('/:id')
  .get(getNote)
  .patch(protect, restrictTo('admin'), updateNote)
  .delete(protect, restrictTo('admin'), deleteNote);

export default router;
