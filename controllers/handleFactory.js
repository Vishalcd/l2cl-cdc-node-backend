import APIfeatures from '../utils/apiFeatures.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// Handle Get all Document
export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // Get Params For Nested route

    // EXECUTE QUERY_________________________________
    const features = new APIfeatures(Model, req.query).filtering().sort().limitFields().pagination();

    const docs = await features.query;

    if (!docs) {
      return next(new AppError(`No ${Model.modelName.toLowerCase()} found.`, 404));
    }

    let totalLength = {};
    // Get unique total for student & employee
    if (req.query.role) totalLength = { role: req.query.role };
    if (req.query.gender) totalLength = { gender: req.query.role };

    const totalResults = await Model.countDocuments(totalLength);

    // SEND RESPONSE_________________________________
    res.status(200).json({
      status: 'success',
      results: docs.length,
      totalResults,
      data: docs,
    });
  });

// Handle Get a Document
export const getOne = (Model, popOption) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOption) {
      popOption.forEach((pop) => {
        query = query.populate(pop);
      });
    }

    const doc = await query;

    if (!doc) {
      return next(new AppError(`No ${Model.modelName.toLowerCase().slice(0, -1)} find with that ID.`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

// Handle Create a Document
export const createOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.create({ ...req.body });

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

// Handle Update a Document
export const updateOne = (Model, field) =>
  catchAsync(async (req, res, next) => {
    if (req.file) req.body[field] = req.file.filename;

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`No ${Model.modelName.toLowerCase().slice(0, -1)} found with that ID.`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

// Handle Delete a Document
export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`No ${Model.modelName.toLowerCase().slice(0, -1)} find with that ID.`, 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
