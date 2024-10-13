import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import Gallery from '../models/galleryModel.js';
import { uploadImage } from '../middlewares/uploadMiddleware.js';
import { createOne, deleteOne, getAll } from './handleFactory.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// gallery photos upload middleware
export const uploadGalleryPhoto = uploadImage.single('photo');

export const resizeGalleryPhoto = (req, res, next) => {
  if (!req.file) return new AppError('Please upload image it is required!', 400);

  req.file.filename = `gallery-${Date.now()}-${uuidv4()}.jpeg`;

  sharp(req.file.buffer).toFormat('jpeg').jpeg({ quality: 60 }).toFile(`public/img/gallery/${req.file.filename}`);

  req.body.photo = req.file.filename;
  next();
};

export const getAllGallery = getAll(Gallery);
export const createGallery = createOne(Gallery);
export const deleteGallery = deleteOne(Gallery);
export const downloadGalleryPhoto = catchAsync(async (req, res, next) => {
  const gallery = await Gallery.findById(req.params.id);

  if (!gallery) return next(new AppError('No Image found with this id.'));

  res.status(200).download(path.join(__dirname, `../public/img/gallery/${gallery.photo}`));
});
