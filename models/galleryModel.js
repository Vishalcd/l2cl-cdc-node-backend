import mongoose from 'mongoose';
import slugify from 'slugify';

const gallerySchema = new mongoose.Schema({
  galleryType: {
    type: String,
    enum: ['sliderGallery', 'gallery'],
    trim: true,
    required: [true, 'Gallery type is required'],
  },
  photo: {
    type: String,
    required: [true, 'Please upload a photo. Photo is required!'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// create a unique type for image
gallerySchema.pre('save', function (next) {
  this.galleryType = slugify(this.galleryType);
  next();
});

const Gallery = mongoose.model('Gallerys', gallerySchema);
export default Gallery;
