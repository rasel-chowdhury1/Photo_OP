const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  snapper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, default: 'General', enum: ['General', 'Editing'] },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Started', 'Rejected', 'Completed'] },
  paymentStatus: { type: String, default: 'Pending', enum: ['Pending', 'Paid'] },
  hasPicUploaded: { type: Boolean, default: false },
  link:{ type: String, required: false },
  isEditFeatureRequired: { type: Boolean, default: false },
  noOfImagesToEdit: { type: Number, default: 0 },
  chargeForEdit: { type: Number, default: 0 },
  amount: { type: Number, required: false },
  startTime: { type: Date, required: false },
  duration: { type: Number, required: false },
  extraTime: { type: Number, default: 0 },
  extraTimeAmount: { type: Number, required: false },
  extraTimeStatus: { type: String, default: 'Not-Required', enum: ['Not-Required', 'Pending', 'Approved'] },
  tip: { type: Number, default: 0 },
  tipStatus: { type: String, default: 'Not-Required', enum: ['Not-Required', 'Given'] },
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);