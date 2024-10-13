import express, { json } from 'express';
import path from 'path';

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// UTILS
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';

// Routes
import userRouter from './routers/userRoutes.js';
import noteRouter from './routers/noteRoutes.js';
import galleryRouter from './routers/galleryRoutes.js';
import placementRouter from './routers/placementRoutes.js';
import courseRouter from './routers/courseRoutes.js';
import transactionRouter from './routers/transactionRoutes.js';
import statsRouter from './routers/statsRoutes.js';
import facultyRouter from './routers/facultyRoutes.js';
import certificateRouter from './routers/certificateRoutes.js';

// Middlewares
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { xss } from 'express-xss-sanitizer';
import hpp from 'hpp';
import compression from 'compression';

const app = express();

//////////////////////--------
//GLOBAL MIDDLEWARES
// Implement CORS
const originUrl = 'http://localhost:5173';
app.use(
  cors({
    origin: originUrl,
    credentials: true,
  })
);

// Parse Cookie Object
app.use(cookieParser());

// parse json
app.use(json());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Set HTTP Security Headers
app.use(helmet());

// Development Logging
app.use(morgan('dev'));

// Limit Request from same API
const limiter = rateLimit({
  limit: 1000,
  windowMs: 60 * 60 * 1000,
  standardHeaders: 'draft-6',
  message: 'Too many requests from this IP, Please try again in an hour!',
});
app.use('/api', limiter);

// Body Parser, Reading data from body
app.use(express.json());

// Data Sanitization againest NOSQl Query injections
app.use(mongoSanitize());

// Data Sanitization againest XSS
app.use(xss());

// Prevent Parameter pollution
app.use(hpp());

// Compress Response Data
app.use(compression());

//////////////////////--------
//ROUTING
app.use('/api/v1/users', userRouter);
app.use('/api/v1/notes', noteRouter);
app.use('/api/v1/gallerys', galleryRouter);
app.use('/api/v1/placements', placementRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/stats', statsRouter);
app.use('/api/v1/faculty', facultyRouter);
app.use('/api/v1/certificates', certificateRouter);

//////////////////////--------
//404 & GLOBAL ERROR HANDLER
app.all('*', async (req, res, next) => {
  return next(new AppError(`Requested url ${req.originalUrl} not found on the server!`, 404));
});

app.use(globalErrorHandler);

export default app;
