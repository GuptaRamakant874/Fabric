const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const fs = require('fs').promises;
const path = require('path');

const processSingleUpload = async (file, folder = 'products') => {
  if (!file) return '';
  if (cloudinary.isConfigured) {
    try {
      const url = await cloudinary.uploadFile(file.path, folder);
      await fs.unlink(file.path);
      return url;
    } catch (error) {
      console.error('Cloudinary upload failed for product image, keeping local:', error);
      return `/uploads/${file.filename}`;
    }
  }
  return `/uploads/${file.filename}`;
};

const getProducts = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const query = {};

    if (category) query.category = category;
    if (featured === 'true') query.featured = true;

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      return next(new Error('Product not found'));
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      material,
      dimensions,
      specifications,
      featured,
      features,
    } = req.body;

    const imageFile = req.files?.image?.[0];
    const galleryFiles = req.files?.gallery || [];

    const imageUrl = await processSingleUpload(imageFile, 'products');
    const galleryUrls = await Promise.all(galleryFiles.map((file) => processSingleUpload(file, 'products/gallery')));

    const parsedFeatures = typeof features === 'string'
      ? features.split('\n').map((line) => line.trim()).filter(Boolean)
      : Array.isArray(features)
        ? features
        : [];

    let parsedSpecifications = {};
    if (specifications) {
      try {
        parsedSpecifications = typeof specifications === 'string'
          ? JSON.parse(specifications)
          : specifications;
      } catch (error) {
        parsedSpecifications = { raw: specifications };
      }
    }

    const product = await Product.create({
      name,
      category,
      description,
      material,
      dimensions,
      image: imageUrl,
      gallery: galleryUrls,
      specifications: parsedSpecifications,
      featured: featured === 'true' || featured === true,
      features: parsedFeatures,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      material,
      dimensions,
      specifications,
      featured,
      features,
      existingGallery,
      existingImage,
    } = req.body;

    let product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      return next(new Error('Product not found'));
    }

    const imageFile = req.files?.image?.[0];
    const galleryFiles = req.files?.gallery || [];

    let imageUrl = existingImage || product.image;
    if (imageFile) {
      imageUrl = await processSingleUpload(imageFile, 'products');
      if (product.image && product.image.startsWith('/uploads/')) {
        const localPath = path.join(__dirname, '..', product.image);
        try {
          await fs.unlink(localPath);
        } catch (err) {
          console.warn('Failed to delete old product image:', err.message);
        }
      }
    }

    let galleryUrls = [];
    if (existingGallery) {
      try {
        galleryUrls = typeof existingGallery === 'string'
          ? JSON.parse(existingGallery)
          : existingGallery;
      } catch (error) {
        galleryUrls = [existingGallery];
      }
    }

    if (galleryFiles.length > 0) {
      const uploadedGallery = await Promise.all(galleryFiles.map((file) => processSingleUpload(file, 'products/gallery')));
      galleryUrls = [...galleryUrls, ...uploadedGallery];
    }

    const parsedFeatures = typeof features === 'string'
      ? features.split('\n').map((line) => line.trim()).filter(Boolean)
      : Array.isArray(features)
        ? features
        : [];

    let parsedSpecifications = {};
    if (specifications) {
      try {
        parsedSpecifications = typeof specifications === 'string'
          ? JSON.parse(specifications)
          : specifications;
      } catch (error) {
        parsedSpecifications = { raw: specifications };
      }
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        description,
        material,
        dimensions,
        image: imageUrl,
        gallery: galleryUrls,
        specifications: parsedSpecifications,
        featured: featured === 'true' || featured === true,
        features: parsedFeatures,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      return next(new Error('Product not found'));
    }

    if (product.image && product.image.startsWith('/uploads/')) {
      const localPath = path.join(__dirname, '..', product.image);
      try {
        await fs.unlink(localPath);
      } catch (err) {
        console.warn('Could not delete old local product image:', err.message);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
