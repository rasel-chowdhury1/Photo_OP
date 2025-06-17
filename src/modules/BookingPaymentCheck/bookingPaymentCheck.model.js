const mongoose = require('mongoose');

const bookingPaymentCheckSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  snapper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  paymentLastTime: { type: Date, required: false },
}, {
  timestamps: true
});

module.exports = mongoose.model('BookingPaymentCheck', bookingPaymentCheckSchema);