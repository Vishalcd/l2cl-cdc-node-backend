import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import Note from '../models/noteModel.js';
import AppError from '../utils/appError.js';

import { uploadImage } from '../middlewares/uploadMiddleware.js';
import { createOne, deleteOne, getAll, getOne, updateOne } from './handleFactory.js';

// pdf cover upload middleware
export const uploadPdfPhoto = uploadImage.single('pdfCover');

export const resizePdfPhoto = (req, res, next) => {
  if (req.method === 'PATCH' && !req.file) return next();
  if (!req.file) return new AppError('Please upload image it is required!', 400);

  req.file.filename = `pdfcover-${Date.now()}-${uuidv4()}.jpeg`;

  sharp(req.file.buffer).toFormat('jpeg').jpeg({ quality: 50 }).toFile(`public/img/pdfCover/${req.file.filename}`);

  req.body.pdfCover = req.file.filename;
  next();
};

export const getAllNotes = getAll(Note);
export const getNote = getOne(Note);
export const createNote = createOne(Note);
export const updateNote = updateOne(Note);
export const deleteNote = deleteOne(Note);
