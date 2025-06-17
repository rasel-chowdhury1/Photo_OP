const response = require("../../helpers/response");
const catchAsync = require('../../helpers/catchAsync');
const { addPaymentData, getPaymentLists, getEarningChart } = require("./paymentData.service");
const { updateBooking } = require("../Booking/booking.service");
const sendNotification = require("../../helpers/formatNotification");

const addNewPaymentData = catchAsync(async (req, res) => {
  req.body.user = req.body.userId;
  const paymentAc = await addPaymentData(req.body);
  // update the booking payment status to paid
  const updatedBooking = await updateBooking(req.body.booking, { paymentStatus: 'Paid' });
  // send notification to snapper
  const message = "You have a booking from " + updatedBooking?.user?.fullName + " on " + updatedBooking?.startTime.toLocaleDateString();
  const data = {
    message,
    linkId: updatedBooking._id,
    type: 'booking',
    role: 'user',
    receiver: updatedBooking.snapper,
  }
  const roomId = "user-notification::" + updatedBooking.snapper.toString();
  await sendNotification(data, roomId);

  return res.status(200).json(response({ status: 'Success', statusCode: '200', type: 'payment', message: req.t('payment-listed'), data: paymentAc }));
})

const allPaymentList = catchAsync(async (req, res) => {
  const filter = {}
  const options = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10
  };
  if (req.body.userRole === 'snapper') {
    filter.snapper = req.body.userId;
  }
  const paymentResult = await getPaymentLists(filter, options);
  return res.status(200).json(response({ status: 'Success', statusCode: '200', type: 'payment', message: req.t('payment-list'), data: paymentResult }));
})

const getPaymentChart = catchAsync(async (req, res) => {
  const year = Number(req.query.year || new Date().getFullYear());
  const paymentResult = await getEarningChart(year);
  return res.status(200).json(response({ status: 'Success', statusCode: '200', type: 'payment', message: req.t('payment-list'), data: paymentResult }));
})

module.exports = { addNewPaymentData, allPaymentList, allPaymentList, getPaymentChart }