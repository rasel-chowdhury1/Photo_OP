const express = require('express');
const { upgradeAboutUs, getAllAboutUs } = require('./aboutUs.controller');
const router = express.Router();
const { isValidUser } = require('../../middlewares/auth')

router.post('/',  isValidUser, upgradeAboutUs);
router.get('/', getAllAboutUs);

module.exports = router;