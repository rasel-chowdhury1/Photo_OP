const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  snapper: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  amountAvailable: {type: Number},
});

module.exports = mongoose.model('Wallet', walletSchema);