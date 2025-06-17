const express = require('express');
const { addNewWallets, getMyWallet } = require('./wallet.controller');
const router = express.Router();
const { isValidUser } = require('../../middlewares/auth')

router.get('/', isValidUser, getMyWallet);

module.exports = router;