const Wallet = require('./wallet.model');

const addWallet = async (walletBody) => {
  let existingWallet = await getWallet(walletBody.snapper);
  if(existingWallet){
    existingWallet.amountAvailable = existingWallet.amountAvailable + walletBody.amountAvailable;
  }
  else{
    existingWallet = new Wallet(walletBody)
  }
  return await existingWallet.save();
}

const updateWallet = async (walletId, updateData) => {
  return await Wallet.findByIdAndUpdate(walletId, updateData, { new: true });
}

const getWallet = async (userId) => {
  return await Wallet.findOne({snapper: userId});
}

module.exports = {
  addWallet,
  updateWallet,
  getWallet
}
