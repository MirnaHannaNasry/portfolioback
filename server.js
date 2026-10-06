require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.join(__dirname, 'uploads')));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) =>
    console.error('MongoDB connection error:', err.message)
  );


app.use('/api/profile', require('./profile'));
app.use('/api/project', require('./project'));
app.use('/api/skill', require('./skill'));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});