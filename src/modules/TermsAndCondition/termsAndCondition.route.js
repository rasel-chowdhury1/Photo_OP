const express = require('express');
const { upgradeTermsAndCondition, getAllTermsAndCondition } = require('./termsAndCondition.controller');
const router = express.Router();
const { isValidUser } = require('../../middlewares/auth')

router.post('/',  isValidUser, upgradeTermsAndCondition);
router.get('/', getAllTermsAndCondition);

module.exports = router;