import express from 'express';
import {
  createGallery,
  deleteGallery,
  getAllGallery,
  resizeGalleryPhoto,
  uploadGalleryPhoto,
  downloadGalleryPhoto,
} from '../controllers/galleryController.mjs';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router
  .route('/')
  .get(getAllGallery)
  .post(protect, restrictTo('admin'), uploadGalleryPhoto, resizeGalleryPhoto, createGallery);
router.delete('/:id', protect, restrictTo('admin'), deleteGallery);
router.get('/:id/download', protect, restrictTo('admin'), downloadGalleryPhoto);

export default router;
