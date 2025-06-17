const mongoose = require('mongoose');

const picUploadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  snapper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  pictures: [{ type: String, required: false }],
  storageSize: { type: Number, required: false },
}, {
  timestamps: true
});

module.exports = mongoose.model('PicUpload', picUploadSchema);