const response = require("../../helpers/response");
const { addTermsAndCondition, getTermsAndCondition } = require('./termsAndCondition.service');
const catchAsync = require('../../helpers/catchAsync');

const upgradeTermsAndCondition = catchAsync(async (req, res) => {
  if (req.body.userRole !== 'admin') {
    return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'termsAndCondition', message: req.t('unauthorised') }));
  }
  const termsAndCondition = await addTermsAndCondition(req.body);
  return res.status(201).json(response({ status: 'Success', statusCode: '201', type: 'termsAndCondition', message: req.t('termsAndCondition-added'), data: termsAndCondition }));
})

const getAllTermsAndCondition = catchAsync(async (req, res) => {
  const termsAndConditions = await getTermsAndCondition();
  return res.status(200).json(response({ status: 'Success', statusCode: '200', message: req.t('termsAndConditions'), data: termsAndConditions }));
})


module.exports = { upgradeTermsAndCondition, getAllTermsAndCondition }