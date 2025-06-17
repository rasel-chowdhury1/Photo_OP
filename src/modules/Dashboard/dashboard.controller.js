const response = require("../../helpers/response");
const { getCustomerCountsAndTotalPayment } = require('./dashboard.service');
const catchAsync = require('../../helpers/catchAsync');

const userCounts = catchAsync(
  async(req, res) => {
    if(req.body.userRole!=='admin'){
      return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'dashboard', message: req.t('unauthorised') }));
    }
    const result = await getCustomerCountsAndTotalPayment()
    return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'dashboard', message: req.t('dashboard'), data: result }));
  }
)

module.exports = { userCounts }