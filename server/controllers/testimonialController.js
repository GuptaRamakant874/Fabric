const Testimonial = require('../models/Testimonial');
const cloudinary = require('../config/cloudinary');
const fs = require('fs').promises;
const path = require('path');

// Helper to handle image upload for testimonial
const processTestimonialUpload = async (file) => {
  if (!file) return '';
  if (cloudinary.isConfigured) {
    try {
      const url = await cloudinary.uploadFile(file.path, 'testimonials');
      await fs.unlink(file.path);
      return url;
    } catch (error) {
      console.error('Cloudinary upload failed for testimonial, keeping local:', error);
      return `/uploads/${file.filename}`;
    }
  } else {
    return `/uploads/${file.filename}`;
  }
};

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private (Admin)
const createTestimonial = async (req, res, next) => {
  try {
    const { clientName, company, message, rating } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = await processTestimonialUpload(req.file);
    }

    const testimonial = await Testimonial.create({
      clientName,
      company,
      message,
      rating: rating ? Number(rating) : 5,
      image: imageUrl,
    });

    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private (Admin)
const updateTestimonial = async (req, res, next) => {
  try {
    const { clientName, company, message, rating, existingImage } = req.body;

    let testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      res.status(404);
      return next(new Error('Testimonial not found'));
    }

    let imageUrl = existingImage || testimonial.image;

    if (req.file) {
      imageUrl = await processTestimonialUpload(req.file);

      // Clean up local temp file if applicable
      if (testimonial.image && testimonial.image.startsWith('/uploads/')) {
        const localPath = path.join(__dirname, '..', testimonial.image);
        try {
          await fs.unlink(localPath);
        } catch (err) {
          console.warn('Could not delete old testimonial image:', err.message);
        }
      }
    }

    testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      {
        clientName,
        company,
        message,
        rating: rating ? Number(rating) : testimonial.rating,
        image: imageUrl,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin)
const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      res.status(404);
      return next(new Error('Testimonial not found'));
    }

    // Clean up local file if exists
    if (testimonial.image && testimonial.image.startsWith('/uploads/')) {
      const localPath = path.join(__dirname, '..', testimonial.image);
      try {
        await fs.unlink(localPath);
      } catch (err) {
        console.warn('Could not delete testimonial image file:', err.message);
      }
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Testimonial removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
