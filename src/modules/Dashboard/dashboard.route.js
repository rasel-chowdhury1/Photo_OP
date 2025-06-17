const express = require('express');
const { userCounts } = require('./dashboard.controller');
const { isValidUser } = require('../../middlewares/auth');
const router = express.Router();

router.get('/counts', isValidUser, userCounts);

module.exports = router;