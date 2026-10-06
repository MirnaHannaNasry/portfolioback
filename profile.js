const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const router = express.Router();




const storage = multer.diskStorage({
  destination: './uploads',

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });



const profileSchema = new mongoose.Schema({
  fullName: String,
  title: String,
  avatarUrl: String,
  bio: String,
  email: String,
  phone: String,
  location: String,
  github: String,
  linkedin: String
});

const Profile = mongoose.model('Profile', profileSchema);




router.get('', async (req, res) => {
  try {

    const profile = await Profile.findOne();

    res.json(profile || {});

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
});



router.put('', upload.single('avatar'), async (req, res) => {

  try {

    const data = {

      fullName: req.body.fullName,
      title: req.body.title,
      bio: req.body.bio,
      email: req.body.email,
      phone: req.body.phone,
      location: req.body.location,
      github: req.body.github,
      linkedin: req.body.linkedin

    };


  
    if (req.file) {

      data.avatarUrl = `/files/${req.file.filename}`;

    }


    const profile = await Profile.findOneAndUpdate(
      {},
      data,
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );


    res.json(profile);

  } catch (err) {

    console.error(err);

    res.status(400).json({
      error: err.message
    });

  }

});


module.exports = router;