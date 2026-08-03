const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const cloudinaryConfig = require('../config/cloudinary');
const mongoose = require('mongoose');
const Product = require('../models/Product');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const IMAGES_DIR = path.resolve(__dirname, '../uploads/catalogue');
const DATA_FILE = path.resolve(__dirname, '../uploads/catalogue/catalogue.json');
const DEFAULT_FOLDER = 'hpy_catalogue';

const readCatalogueData = async () => {
  if (!fs.existsSync(DATA_FILE)) {
    throw new Error(`Catalogue JSON not found at ${DATA_FILE}. Please provide extracted data first.`);
  }
  const raw = await fs.promises.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
};

const uploadImage = async (imagePath, productName) => {
  if (!cloudinary.isConfigured) {
    throw new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
  }

  const publicId = productName.replace(/\s+/g, '_').replace(/[^A-Za-z0-9_-]/g, '').toLowerCase();

  console.log(`Uploading image for product: ${productName}`);

  try {
    const result = await cloudinaryConfig.cloudinary.uploader.upload(imagePath, {
      folder: DEFAULT_FOLDER,
      public_id: publicId,
      overwrite: false,
      resource_type: 'image',
    });

    console.log(`Uploaded ${path.basename(imagePath)} => ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    if (error.http_code === 409 || error.name === 'Error' || error.message?.includes('already exists')) {
      console.warn(`Skipping upload because product already exists on Cloudinary: ${productName}`);
      return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${DEFAULT_FOLDER}/${publicId}`;
    }

    console.error(`Failed to upload image for ${productName}:`, error.message || error);
    throw error;
  }
};

const seedProducts = async (products) => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fab-company';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log(`Connected to MongoDB: ${mongoUri}`);

  for (const product of products) {
    const existing = await Product.findOne({ name: product.name });
    if (existing) {
      console.log(`Skipping existing product: ${product.name}`);
      continue;
    }

    const created = await Product.create(product);
    console.log(`Inserted product: ${created.name}`);
  }

  console.log(`Product seeding complete. Total inserted: ${products.length}`);
  await mongoose.disconnect();
};

const run = async () => {
  try {
    const catalogue = await readCatalogueData();
    const productsWithUrls = [];

    for (const item of catalogue) {
      const imageName = item.imageFile || item.name;
      const imagePath = path.resolve(IMAGES_DIR, `${imageName}.jpg`);

      if (!fs.existsSync(imagePath)) {
        console.warn(`Image file not found for product ${item.name}: ${imagePath}`);
        productsWithUrls.push({ ...item, image: '' });
        continue;
      }

      const secureUrl = await uploadImage(imagePath, item.name);
      productsWithUrls.push({ ...item, image: secureUrl });
    }

    const seedData = productsWithUrls.map((product) => ({
      name: product.name,
      category: product.category || 'Uncategorized',
      description: product.description || '',
      features: Array.isArray(product.features) ? product.features : product.features?.split('\n').filter(Boolean) || [],
      material: product.material || '',
      dimensions: product.dimensions || '',
      image: product.image || '',
      gallery: Array.isArray(product.gallery) ? product.gallery : [],
      specifications: product.specifications || {},
      featured: !!product.featured,
    }));

    await seedProducts(seedData);
    console.log('Upload and seed complete.');
  } catch (error) {
    console.error('Upload catalogue script failed:', error.message || error);
    process.exit(1);
  }
};

run();
