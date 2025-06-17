const response = require("../../helpers/response");
const { addAboutUs, getAboutUs } = require('./aboutUs.service');
const catchAsync = require('../../helpers/catchAsync');

const upgradeAboutUs = catchAsync(async (req, res) => {
  if (req.body.userRole !== 'admin') {
    return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'aboutUs', message: req.t('unauthorised') }));
  }
  const aboutUs = await addAboutUs(req.body);
  return res.status(201).json(response({ status: 'Success', statusCode: '201', type: 'aboutUs', message: req.t('aboutUs-added'), data: aboutUs }));
})

const getAllAboutUs = catchAsync(async (req, res) => {
  const aboutUss = await getAboutUs();
  return res.status(200).json(response({ status: 'Success', statusCode: '200', message: req.t('aboutUss'), data: aboutUss }));
})


module.exports = { upgradeAboutUs, getAllAboutUs }