import express from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import {
  createCertificate,
  deleteCertificate,
  getAllCertificate,
  getCertificate,
  updateCertificate,
} from '../controllers/certificateController.mjs';
import { uploadPdf } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Protect all route for admin only
router.use(protect);
router
  .route('/')
  .get(restrictTo('admin'), getAllCertificate)
  .post(restrictTo('admin'), uploadPdf.single('certificate'), createCertificate);
router
  .route('/:id')
  .get(getCertificate)
  .patch(restrictTo('admin'), uploadPdf.single('certificate'), updateCertificate)
  .delete(restrictTo('admin'), deleteCertificate);

export default router;
