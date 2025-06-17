const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image: { type: String, required: false },
  category: { type: String, required: false },
  clickedAt: { type: Date, required: false },
  place: { type: String, required: false },
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Portfolio', portfolioSchema);