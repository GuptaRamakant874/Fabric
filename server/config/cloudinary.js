const cloudinary = require('cloudinary').v2;

const isConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('Cloudinary successfully configured.');
} else {
  console.warn('Cloudinary credentials missing. File uploads will default to local storage.');
}

const uploadFile = async (filePath, folder = 'fab_steel') => {
  if (!isConfigured) {
    return null;
  }
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto', // Detects PDF, DOCX, images, etc.
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary Upload Helper Error:', error);
    throw error;
  }
};

module.exports = { isConfigured, uploadFile };
