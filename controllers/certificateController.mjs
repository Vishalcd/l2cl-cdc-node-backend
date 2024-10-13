import path from 'path';

import { v4 as uuidv4 } from 'uuid';
import { deleteOne, getAll, updateOne } from './handleFactory.js';
import Certificate from '../models/certificateModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import User from '../models/userModel.js';

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// get certificate
export const getCertificate = catchAsync(async (req, res, next) => {
  const { id: enrollId } = req.params;

  const user = await User.findOne({ enrollId });
  if (!user) return next(new AppError('No User found with this enroll ID', 404));

  if (user.id !== req.user.id) return next(new AppError('Unauthorized you can not download this certificate', 401));

  // find certificate with enroll id
  const certificate = await Certificate.findOne({ userId: user._id });

  // if no certificate found
  if (!certificate) return next(new AppError('No Certificate Found. Please try again', 404));

  // if user not allow to download his certificate
  if (certificate.downloadPermission === 'false')
    return next(new AppError('You are not allow to download Certificate.', 400));

  // download the certificate pdf
  res.status(200).download(path.join(__dirname, `../public/pdfs/${certificate.certificate}`));
});

// create new certificate
export const createCertificate = catchAsync(async (req, res, next) => {
  const { enrollId } = req.body;

  // find user with this enroll id
  const user = await User.findOne({ enrollId });
  if (!user) return next(new AppError('No User found with this enrollId', 404));

  // create new certificate with user data
  const newCertificate = {
    userId: user._id,
    certificateId: uuidv4().split('-')[0],
    name: user.name,
    gender: user.gender,
    fatherName: user.fatherName,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    course: req.body.course,
    downloadPermission: req.body.downloadPermission,
    certificate: req.file.filename,
    certificateType: user.role === 'employee' ? 'work-experience' : 'certificate',
  };
  const certificate = await Certificate.create(newCertificate);

  res.status(200).json({
    status: 'success',
    data: certificate,
  });
});

export const updateCertificate = updateOne(Certificate, 'certificate');
export const getAllCertificate = getAll(Certificate);
export const deleteCertificate = deleteOne(Certificate);
