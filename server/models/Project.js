const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
      enum: ['Industrial', 'Commercial', 'Residential', 'Custom'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    images: {
      type: [String],
      required: [true, 'At least one project image is required'],
      validate: [
        (val) => val.length > 0,
        'Project must have at least one image URL',
      ],
    },
    client: {
      type: String,
      trim: true,
      default: '',
    },
    completedDate: {
      type: Date,
      default: Date.now,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
