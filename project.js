const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const router = express.Router();


// =======================
// Project Schema
// =======================

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required']
    },

    description: String,

    imageUrl: String,

    projectUrl: String,

    githubUrl: String,

    tags: [String],

    featured: {
      type: Boolean,
      default: false
    },

    // Soft Delete
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);


const Project = mongoose.model('Project', projectSchema);


// =======================
// Multer
// =======================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }

});

const upload = multer({ storage });


// =======================
// Build Data
// =======================

const buildData = (req) => {

  const data = { ...req.body };

  if (typeof data.tags === 'string') {

    data.tags = data.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

  }

  if (req.file) {

    data.imageUrl = req.file.filename;

  }

  return data;
};


// =======================
// GET All Projects
// =======================
// نجيب المشاريع اللي مش محذوفة Soft Delete

router.get('', async (req, res) => {

  try {

    const projects = await Project
      .find({ isDeleted: false })
      .sort({ createdAt: -1 });

    res.json(projects);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// =======================
// ADD Project
// =======================

router.post('', async (req, res) => {

  try {

    const project = await Project.create(req.body);

    res.status(201).json(project);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });

  }

});


// =======================
// GET Project By ID
// =======================

router.get('/:id', async (req, res) => {

  try {

    const project = await Project.findById(req.params.id);

    if (!project) {

      return res.status(404).json({
        error: 'Project not found'
      });

    }

    res.json(project);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// =======================
// UPDATE Project
// =======================

router.put('/:id', async (req, res) => {

  try {

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!project) {

      return res.status(404).json({
        error: 'Project not found'
      });

    }

    res.json(project);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });

  }

});


// =======================
// SOFT DELETE Project
// =======================

router.delete('/:id', async (req, res) => {

  try {

    const project = await Project.findByIdAndUpdate(
      req.params.id,

      {
        isDeleted: true
      },

      {
        new: true
      }
    );

    if (!project) {

      return res.status(404).json({
        error: 'Project not found'
      });

    }

    res.json({
      message: 'Project moved to trash',
      project
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


module.exports = router;