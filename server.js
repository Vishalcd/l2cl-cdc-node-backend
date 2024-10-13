import mongoose from 'mongoose';
import dotenv from 'dotenv';

process.on('uncaughtException', (error) => {
  console.warn(error);
  console.warn('uncaughtException ❌ Shutting down...');
  process.exit(1);
});

// REGISTER DOT ENV FILE
dotenv.config({ path: './config.env' });
import app from './app.mjs';

// SERVER START
const port = 8000;
const server = app.listen(port, () => {
  console.log(`✅ App running on port ${port}....`);
});

// DATABSE CONNECTION
mongoose.connect(process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)).then(() => {
  console.log('✅ Database connected succesfully!');
});

process.on('unhandledRejection', (error) => {
  console.warn(error.name, error.message);
  console.warn('unhandledRejection ❌ Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
