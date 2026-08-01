const Project = require('../models/Project');
const cloudinary = require('../config/cloudinary');
const fs = require('fs').promises;
const path = require('path');

// Helper to handle multiple uploads (Cloudinary or local static serving)
const processUploadedFiles = async (files) => {
  const imageUrls = [];
  if (!files || files.length === 0) return imageUrls;

  for (const file of files) {
    if (cloudinary.isConfigured) {
      try {
        const url = await cloudinary.uploadFile(file.path, 'projects');
        imageUrls.push(url);
        // Remove local file
        await fs.unlink(file.path);
      } catch (error) {
        console.error('Cloudinary upload failed, keeping local file:', error);
        imageUrls.push(`/uploads/${file.filename}`);
      }
    } else {
      imageUrls.push(`/uploads/${file.filename}`);
    }
  }
  return imageUrls;
};

// @desc    Get all projects (optionally filter by category)
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }
    if (featured === 'true') {
      query.featured = true;
    }

    const projects = await Project.find(query).sort({ completedDate: -1 });
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      return next(new Error('Project not found'));
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin)
const createProject = async (req, res, next) => {
  try {
    const { title, category, description, client, completedDate, featured } = req.body;

    // Check if files uploaded
    if (!req.files || req.files.length === 0) {
      res.status(400);
      return next(new Error('Please upload at least one image'));
    }

    const uploadedUrls = await processUploadedFiles(req.files);

    const project = await Project.create({
      title,
      category,
      description,
      client,
      completedDate,
      featured: featured === 'true' || featured === true,
      images: uploadedUrls,
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
const updateProject = async (req, res, next) => {
  try {
    const { title, category, description, client, completedDate, featured, existingImages } = req.body;

    let project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      return next(new Error('Project not found'));
    }

    // Parse existing images (sent back by front end)
    let images = [];
    if (existingImages) {
      try {
        images = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
      } catch (e) {
        images = [existingImages];
      }
    }

    // Process any newly uploaded files
    if (req.files && req.files.length > 0) {
      const newUrls = await processUploadedFiles(req.files);
      images = [...images, ...newUrls];
    }

    if (images.length === 0) {
      res.status(400);
      return next(new Error('Project must have at least one image'));
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title,
        category,
        description,
        client,
        completedDate,
        featured: featured === 'true' || featured === true,
        images,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      return next(new Error('Project not found'));
    }

    // Optional: Delete local files if saved locally
    for (const imgUrl of project.images) {
      if (imgUrl.startsWith('/uploads/')) {
        const localPath = path.join(__dirname, '..', imgUrl);
        try {
          await fs.unlink(localPath);
        } catch (err) {
          console.warn('Could not delete local file during project deletion:', err.message);
        }
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Project removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
