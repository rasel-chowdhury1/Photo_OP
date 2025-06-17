const mongoose = require('mongoose');

const paymentDataSchema = new mongoose.Schema({
  paymentId: { type: String, required: true },
  amount: { type: Number, required: true },
  user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
  snapper: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
  payFor: { type: String, enum: ['Payment', 'Tip'], default: 'Payment' },
  booking: { type: mongoose.SchemaTypes.ObjectId, ref: 'Booking', required: false }
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PaymentData', paymentDataSchema);