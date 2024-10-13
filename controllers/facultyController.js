import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import { uploadImage } from '../middlewares/uploadMiddleware.js';
import Faculty from '../models/facultyModel.js';
import { createOne, deleteOne, getAll, getOne, updateOne } from './handleFactory.js';
import AppError from '../utils/appError.js';

// faculty photo upload middleware
export const uploadFacultyPhoto = uploadImage.single('photo');

export const resizeFacultyPhoto = (req, res, next) => {
  if (req.method === 'PATCH' && !req.file) return next();
  if (!req.file) return next(new AppError('Please upload a image. New Faclty required a image. '));

  req.file.filename = `faculty-${Date.now()}-${uuidv4()}.jpeg`;

  sharp(req.file.buffer).toFormat('jpeg').jpeg({ quality: 60 }).toFile(`public/img/faculty/${req.file.filename}`);

  req.body.photo = req.file.filename;
  next();
};

export const getAllFaculty = getAll(Faculty);
export const createFaculty = createOne(Faculty);
export const getFaculty = getOne(Faculty);
export const updateFaculty = updateOne(Faculty);
export const deleteFaculty = deleteOne(Faculty);
