const express = require('express');
const { addNewPicUpload, getSnappedPicForAppointment } = require('./picUpload.controller');
const router = express.Router();

const { isValidUser } = require('../../middlewares/auth')

//follow routes
router.post('/', isValidUser, addNewPicUpload);

// spanner all booking routes
router.get('/:id', getSnappedPicForAppointment);

module.exports = router;