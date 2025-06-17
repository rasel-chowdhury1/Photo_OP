const express = require('express');
const { upgradePrivacyPolicy, getAllPrivacyPolicy } = require('./privacyPolicy.controller');
const router = express.Router();
const { isValidUser } = require('../../middlewares/auth')

router.post('/',  isValidUser, upgradePrivacyPolicy);
router.get('/', getAllPrivacyPolicy);

module.exports = router;