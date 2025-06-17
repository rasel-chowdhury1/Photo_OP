const express = require('express');
const { addNewWithdrawRequests, editWithdrawRequests, getAllWithdrawRequests } = require('./withdrawRequest.controller');
const router = express.Router();
const { isValidUser } = require('../../middlewares/auth')

router.post('/', isValidUser, addNewWithdrawRequests);
router.put('/:id', isValidUser, editWithdrawRequests);
router.get('/', isValidUser, getAllWithdrawRequests);

module.exports = router;