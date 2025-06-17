const mongoose = require('mongoose');

const aboutUsSchema = new mongoose.Schema({
  content: { type: String, required: true },
});

module.exports = mongoose.model('AboutUs', aboutUsSchema);