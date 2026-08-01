const Service = require('../models/Service');
const cloudinary = require('../config/cloudinary');
const fs = require('fs').promises;
const path = require('path');

// Helper to handle single file upload (Cloudinary or local static serving)
const processSingleUpload = async (file) => {
  if (!file) return '';
  if (cloudinary.isConfigured) {
    try {
      const url = await cloudinary.uploadFile(file.path, 'services');
      await fs.unlink(file.path);
      return url;
    } catch (error) {
      console.error('Cloudinary upload failed for service image, keeping local:', error);
      return `/uploads/${file.filename}`;
    }
  } else {
    return `/uploads/${file.filename}`;
  }
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Admin)
const createService = async (req, res, next) => {
  try {
    const { title, description, icon, order } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = await processSingleUpload(req.file);
    }

    const service = await Service.create({
      title,
      description,
      icon: icon || 'Wrench',
      image: imageUrl,
      order: order ? Number(order) : 0,
    });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Admin)
const updateService = async (req, res, next) => {
  try {
    const { title, description, icon, order, existingImage } = req.body;

    let service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404);
      return next(new Error('Service not found'));
    }

    let imageUrl = existingImage || service.image;

    if (req.file) {
      // Process new upload
      imageUrl = await processSingleUpload(req.file);

      // Clean up previous local file if applicable
      if (service.image && service.image.startsWith('/uploads/')) {
        const localPath = path.join(__dirname, '..', service.image);
        try {
          await fs.unlink(localPath);
        } catch (err) {
          console.warn('Could not delete old service image:', err.message);
        }
      }
    }

    service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        icon: icon || service.icon,
        image: imageUrl,
        order: order ? Number(order) : service.order,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Admin)
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404);
      return next(new Error('Service not found'));
    }

    // Clean up local file if exists
    if (service.image && service.image.startsWith('/uploads/')) {
      const localPath = path.join(__dirname, '..', service.image);
      try {
        await fs.unlink(localPath);
      } catch (err) {
        console.warn('Could not delete service image file during deletion:', err.message);
      }
    }

    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Service removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService,
};
