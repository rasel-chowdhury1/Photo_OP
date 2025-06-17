require('dotenv').config();
const response = require("../../helpers/response");
const { getNotifications } = require('./notification.service');
const catchAsync = require('../../helpers/catchAsync');

const getAllNotifications = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const options = {
    page, limit
  }
  let filter = {};
  if(req.body.userId){
    filter.role = req.body.userRole
  }
  const { notificationList, pagination } = await getNotifications(filter, options);
  return res.status(200).json(response({ status: 'Success', statusCode: '200', message: req.t('notification-list'), data: { notificationList, pagination } }));
})

module.exports = { getAllNotifications }