const mongoose = require('mongoose');

const withdrawRequestSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  amount: {type: Number},
  status: {type: String, default: ['Pending', 'Approved', 'Rejected'], default: 'Pending'},
  paymentGateway: {type: String, default: ['Bank', 'Paypal'], default: 'bank'},
  bankInfo: {
    bankName: {type: String, required: false},
    accountNumber: {type: String, required: false},
    accountName: {type: String, required: false},
    accountType: {type: String, required: false}
  },
  paypalInfo:{
    accountName:{ type: String, required: false },
    bsbNumber:{ type: String, required: false },
    accountNumber:{ type: String, required: false },
    bicCode:{ type: String, required: false },
    recipientAddress:{ type: String, required: false },
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('WithdrawRequest', withdrawRequestSchema);