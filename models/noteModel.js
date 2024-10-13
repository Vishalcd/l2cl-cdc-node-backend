import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  pdfTitle: {
    type: String,
    trim: true,
    required: [true, 'PDF name is required.'],
  },
  subject: {
    type: String,
    trim: true,
    required: [true, 'Subject name is required.'],
  },

  pdfLink: {
    type: String,
    required: [true, 'PDF Link is required.'],
  },
  pdfCover: {
    type: String,
    required: [true, 'PDF Cover is required.'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Note = mongoose.model('Notes', noteSchema);
export default Note;
