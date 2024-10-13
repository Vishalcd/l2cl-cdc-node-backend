import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import { uploadImage } from '../middlewares/uploadMiddleware.js';
import Placement from '../models/placementModel.js';
import { createOne, deleteOne, getAll, getOne, updateOne } from './handleFactory.js';
// import AppError from '../utils/appError.js';

// placement photo upload middleware
export const uploadPlacementPhoto = uploadImage.single('photo');

export const resizePlacementPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `placement-${Date.now()}-${uuidv4()}.jpeg`;

  sharp(req.file.buffer).toFormat('jpeg').jpeg({ quality: 60 }).toFile(`public/img/placements/${req.file.filename}`);

  req.body.photo = req.file.filename;
  next();
};

export const getAllPlacement = getAll(Placement);
export const createPlacement = createOne(Placement);
export const getPlacement = getOne(Placement);
export const updatePlacement = updateOne(Placement);
export const deletePlacement = deleteOne(Placement);
