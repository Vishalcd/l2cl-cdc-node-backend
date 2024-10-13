import express from 'express';
import {
  createPlacement,
  deletePlacement,
  getAllPlacement,
  getPlacement,
  resizePlacementPhoto,
  updatePlacement,
  uploadPlacementPhoto,
} from '../controllers/placementController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router
  .route('/')
  .get(getAllPlacement)
  .post(protect, restrictTo('admin'), uploadPlacementPhoto, resizePlacementPhoto, createPlacement);
router
  .route('/:id')
  .get(protect, restrictTo('admin'), getPlacement)
  .patch(protect, restrictTo('admin'), uploadPlacementPhoto, resizePlacementPhoto, updatePlacement)
  .delete(protect, restrictTo('admin'), deletePlacement);

export default router;
