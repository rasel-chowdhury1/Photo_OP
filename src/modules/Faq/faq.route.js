const express = require('express');
const { upgradeFaq, getAllFaqs, deleteFaq } = require('./faq.controller');
const router = express.Router();
const { isValidUser } = require('../../middlewares/auth')

router.post('/',  isValidUser, upgradeFaq);
router.get('/', getAllFaqs);
router.delete('/:id', isValidUser, deleteFaq);

module.exports = router;