import Course from '../models/courseModel.js';
import { createOne, deleteOne, getAll, getOne, updateOne } from './handleFactory.js';

export const getAllCourses = getAll(Course);
export const getCourse = getOne(Course);
export const createCourse = createOne(Course);
export const updateCourse = updateOne(Course);
export const deleteCourse = deleteOne(Course);
