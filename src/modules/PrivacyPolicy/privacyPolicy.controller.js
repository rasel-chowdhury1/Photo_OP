const response = require("../../helpers/response");
const { addPrivacyPolicy, getPrivacyPolicy } = require('./privacyPolicy.service');
const catchAsync = require('../../helpers/catchAsync');

const upgradePrivacyPolicy = catchAsync(async (req, res) => {
  if (req.body.userRole !== 'admin') {
    return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'privacyPolicy', message: req.t('unauthorised') }));
  }
  const privacyPolicy = await addPrivacyPolicy(req.body);
  return res.status(201).json(response({ status: 'Success', statusCode: '201', type: 'privacyPolicy', message: req.t('privacyPolicy-added'), data: privacyPolicy }));
})

const getAllPrivacyPolicy = catchAsync(async (req, res) => {
  const privacyPolicys = await getPrivacyPolicy();
  return res.status(200).json(response({ status: 'Success', statusCode: '200', message: req.t('privacyPolicys'), data: privacyPolicys }));
})


module.exports = { upgradePrivacyPolicy, getAllPrivacyPolicy }