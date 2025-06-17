const catchAsync = require('../../helpers/catchAsync')
const response = require("../../helpers/response");
const { addWallet, getWallet } = require('./wallet.service');

const addNewWallets = catchAsync(async (req, res) => {
  req.body.snapper = req.body.userId;
  const walletStatus = await addWallet(req.body);
  return res.status(201).json(response({ status: 'OK', statusCode: '201', type: 'wallet', message: req.t('wallet-added'), data: walletStatus }));
});

const getMyWallet = catchAsync(async (req, res) => {
  let wallets = await getWallet(req.body.userId);
  if (!wallets) {
    wallets = {
      snapper: req.body.userId,
      amountAvailable: 0,
    };
  }
  return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'wallet', message: req.t('wallet'), data: wallets }));
});

module.exports = { addNewWallets, getMyWallet }