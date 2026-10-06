const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();


const skillSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'Skill name is required']
  },

  category: String,

  proficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: 80
  },

  order: {
    type: Number,
    default: 0
  },

  isDeleted: {
    type: Boolean,
    default: false
  }

});


const Skill = mongoose.model('Skill', skillSchema);


// =========================
// GET Skills
// =========================

router.get('', async (req, res) => {

  try {

    const skills = await Skill
      .find({ isDeleted: false })
      .sort({ order: 1 });

    res.json(skills);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// =========================
// ADD Skill
// =========================

router.post('', async (req, res) => {

  try {

    const skill = await Skill.create(req.body);

    res.status(201).json(skill);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });

  }

});


// =========================
// UPDATE Skill
// =========================

router.put('/:id', async (req, res) => {

  try {

    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!skill) {

      return res.status(404).json({
        error: 'Skill not found'
      });

    }

    res.json(skill);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });

  }

});


// =========================
// DELETE Skill
// =========================

router.delete('/:id', async (req, res) => {

  try {

    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true
      },
      {
        new: true
      }
    );

    if (!skill) {

      return res.status(404).json({
        error: 'Skill not found'
      });

    }

    res.json({
      message: 'Skill moved to trash',
      skill
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


module.exports = router;