import multer from 'multer';
import AppError from '../utils/appError.js';
import { v4 as uuid } from 'uuid';

const multerStorage = multer.memoryStorage();

const multerStoragePdf = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/pdfs/');
  },
  filename: function (req, file, cb) {
    const ex = file.mimetype.split('/')[1];
    const fileName = `pdf-${uuid()}-${Date.now()}.${ex}`;
    cb(null, fileName);
  },
});

const multerFilter = (type) => {
  return (req, file, cb) => {
    if (file.mimetype.startsWith(type)) {
      cb(null, true);
    } else {
      cb(new AppError(`Not an ${type}. Please upload only ${type}!`, 400), false);
    }
  };
};

export const uploadImage = multer({
  storage: multerStorage,
  fileFilter: multerFilter('image'),
});

export const uploadPdf = multer({
  storage: multerStoragePdf,
  fileFilter: multerFilter('application'),
});
