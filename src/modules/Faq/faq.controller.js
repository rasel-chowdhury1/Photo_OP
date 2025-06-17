require('dotenv').config();
const catchAsync = require('../../helpers/catchAsync');
const response = require("../../helpers/response");
const { addFaq, getFaqs, deleteAFaq } = require('./faq.service');

const upgradeFaq = catchAsync(async (req, res) => {
  if (req.body.userRole !== 'admin') {
    return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'faq', message: req.t('unauthorised') }));
  }
  const faq = await addFaq(req.body);
  return res.status(201).json(response({ status: 'Success', statusCode: '201', type: 'faq', message: req.t('faq-added'), data: faq }));
})

const getAllFaqs = catchAsync(async (req, res) => {
  const faqs = await getFaqs();
  return res.status(200).json(response({ status: 'Success', statusCode: '200', message: req.t('faqs'), data: faqs }));
})

const deleteFaq = catchAsync(async (req, res) => {
  if (req.body.userRole !== 'admin') {
    return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'faq', message: req.t('unauthorised') }));
  }
  const faq = await deleteAFaq(req.params.id);
  return res.status(201).json(response({ status: 'Success', statusCode: '200', type: 'faq', message: req.t('faq-deleted'), data: faq }));
})

module.exports = { upgradeFaq, getAllFaqs, deleteFaq }