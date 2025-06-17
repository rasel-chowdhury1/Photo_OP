const catchAsync = require('../../helpers/catchAsync');
const sendNotification = require('../../helpers/formatNotification');
const response = require("../../helpers/response");
const { addBookingPaymentCheck } = require('../BookingPaymentCheck/bookingPaymentCheck.service');
const { addWallet } = require('../Wallet/wallet.service');
const { addBooking, getBookings, getBookingById, updateBooking } = require('./booking.service');

const addNewBooking = catchAsync(async (req, res) => {
  req.body.user = req.body.userId;
  req.body.amount = Number(req.body.amount);
  req.body.startTime = new Date(req.body.startTime);
  const bookingStatus = await addBooking(req.body);
  return res.status(201).json(response({ status: 'OK', statusCode: '201', type: 'booking', message: req.t('booking-added'), data: bookingStatus }));
});

const getAllBookings = catchAsync(async (req, res) => {
  let filter = {};
  const options = {
    limit: Number(req.query.limit) || 10,
    page: Number(req.query.page) || 1,
  };

  if (req.body.userRole === 'user') {
    filter.user = req.body.userId
  }
  // Check if the status is approved
  const status = req.query.status;

  if (status && status !== 'null' && status !== '' && status !== undefined) {
    if (status === 'pending') {
      filter.status = 'Pending';
    }
    else if (status === 'payment-request') {
      filter.status = 'Approved';
      filter.paymentStatus = 'Pending';
    }
    else if (status === 'started') {
      filter.status = 'Started';
    }
    else if (status === 'upcoming') {
      filter.status = 'Approved';
      filter.paymentStatus = 'Paid';
    }
    else if (status === 'completed') {
      filter.status = 'Completed';
    }
  }
  const bookingsList = await getBookings(filter, options);
  return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'booking', message: req.t('bookings-list'), data: bookingsList }));
});

const getBookingDetails = catchAsync(async (req, res) => {
  const bookingDetails = await getBookingById(req.params.id);
  return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'booking', message: req.t('bookings-details'), data: bookingDetails }));
});

const getAllBookingsForsnapper = catchAsync(async (req, res) => {
  console.log(req.body.userId);
  let filter = {
    snapper: req.body.userId
  };
  const options = {
    limit: Number(req.query.limit) || 10,
    page: Number(req.query.page) || 1,
  };
  // Check if the status is approved
  const status = req.query.status;
  if (status && status !== 'null' && status !== '' && status !== undefined) {
    if (status === 'pending') {
      filter.status = 'Pending';
    }
    else if (status === 'payment-request') {
      filter.status = 'Approved';
      isAdminAccepted = 'Approved';
    }
    else if (status === 'started') {
      filter.status = 'Started';
      isAdminAccepted = 'Approved';
    }
    else if (status === 'upcoming') {
      filter.status = 'Approved';
      filter.paymentStatus = 'Paid';
    }
    else if (status === 'completed') {
      filter.status = 'Completed';
    }
  }
  const bookingsList = await getBookings(filter, options);
  return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'booking', message: req.t('bookings-list'), data: bookingsList }));
});

const updateAnBookingBysnapper = catchAsync(async (req, res) => {
  const myBooking = await getBookingById(req.params.id);
  if (!myBooking) {
    return res.status(400).json(response({ status: 'error', statusCode: '400', message: 'Booking not found' }));
  }
  if (myBooking?.snapper?._id.toString() !== req.body.userId.toString()) {
    return res.status(400).json(response({ status: 'error', statusCode: '400', message: 'Unauthorised' }));
  }
  if (myBooking.status !== 'Pending') {
    return res.status(400).json(response({ status: 'error', statusCode: '400', message: 'already-approved' }));
  }
  // save the booking
  myBooking.status = req.body.status;
  myBooking.save();

  if (req.body.status === 'Approved') {
    // update the booking check system
    const now = new Date();
    const diff = new Date(myBooking.startTime) - now;
    const diffInMinutes = Math.floor(diff / 60000);
    const timeToPay = diffInMinutes * 0.6;
    const timeToPayDate = new Date(now.getTime() + timeToPay * 60000);

    const checkingData = {
      user: myBooking.user._id,
      booking: myBooking._id,
      snapper: myBooking.snapper._id,
      paymentLastTime: timeToPayDate
    }
    await addBookingPaymentCheck(checkingData);


    // send notification to snapper
    const message = "You have a booking with " + req.body.userFullName + ". Please pay within " + timeToPayDate.toLocaleString() + ".";
    const data = {
      message,
      linkId: myBooking._id,
      type: 'booking',
      role: 'user',
      receiver: myBooking.user._id,
    }
    const roomId = "user-notification::" + myBooking.user._id.toString();
    await sendNotification(data, roomId);
  }
  return res.status(200).json(response({ status: 'OK', statusCode: '200', message: 'booking-updated', data: myBooking }));
});

const startBookingBysnapper = catchAsync(async (req, res) => {
  const myBooking = await getBookingById(req.params.id);
  console.log('---------------------> hello booking --------------------->', myBooking)
  console.log(myBooking);
  if (!myBooking) {
    return res.status(400).json(response({ status: 'error', statusCode: '400', message: req.t('booking-not-found') }));
  }
  if (myBooking?.snapper?._id.toString() !== req.body.userId.toString()) {
    return res.status(400).json(response({ status: 'error', statusCode: '400', message: req.t('Unauthorised') }));
  }
  if (myBooking.paymentStatus === 'Pending') {
    return res.status(402).json(response({ status: 'error', statusCode: '402', message: req.t('payment-required') }));
  }
  // save the booking
  myBooking.status = req.body.status;
  myBooking.save();

  if (req.body.status === 'Started') {
    const message = "You have a booking has been started by " + req.body.userFullName + ".";
    const data = {
      message,
      linkId: myBooking._id,
      type: 'booking',
      role: 'user',
      receiver: myBooking.user._id,
    }
    const roomId = "user-notification::" + myBooking.user._id.toString();
    await sendNotification(data, roomId);
  }
  return res.status(200).json(response({ status: 'OK', statusCode: '200', message: 'booking-updated', data: myBooking }));
});

const completeBookingBysnapper = catchAsync(async (req, res) => {
  const myBooking = await getBookingById(req.params.id);
  if (!myBooking) {
    return res.status(400).json(response({ status: 'error', statusCode: '400', message: 'Booking not found' }));
  }
  if (myBooking?.snapper?._id.toString() !== req.body.userId.toString()) {
    return res.status(401).json(response({ status: 'error', statusCode: '401', message: 'Unauthorised' }));
  }
  if (myBooking.status !== 'Started' || !myBooking?.hasPicUploaded) {
    return res.status(400).json(response({ status: 'error', statusCode: '400', message: 'requirement-mismatch' }));
  }
  // save the booking
  myBooking.status = req.body.status;
  myBooking.snappingCompleted = myBooking.snappingCompleted + 1;
  myBooking.save();

  if (req.body.status === 'Completed') {
    const message = "You have a booking has been marked as completed by " + req.body.userFullName + ".";
    const data = {
      message,
      linkId: myBooking._id,
      type: 'booking',
      role: 'user',
      receiver: myBooking.user._id,
    }
    const roomId = "user-notification::" + myBooking.user._id.toString();
    await sendNotification(data, roomId);
    const userAmount = Math.ceil(myBooking.amount*0.90);
    await addWallet({ snapper: myBooking.snapper, amountAvailable: userAmount });
  }
  return res.status(200).json(response({ status: 'OK', statusCode: '200', message: 'booking-updated', data: myBooking }));
});

const updateAnBooking = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updatedBooking = await updateBooking(id, req.body);
  return res.status(200).json(response({ status: 'OK', statusCode: '200', message: 'booking-updated', data: updatedBooking }));
});

const requestExtraTime = catchAsync(async (req, res) => {
  const myBooking = await updateBooking(req.params.id, req.body);
  const message = "You have a extra-time request from " + myBooking.user.fullName + ".";
  const data = {
    message,
    linkId: myBooking._id,
    type: 'extra-time',
    role: 'user',
    receiver: myBooking.snapper,
  }
  const roomId = "user-notification::" + myBooking.snapper._id.toString();
  await sendNotification(data, roomId);

  return res.status(200).json(response({ status: 'OK', statusCode: '200', message: 'booking-updated', data: myBooking }));
});

const acceptRequestExtraTime = catchAsync(async (req, res) => {
  const myBooking = await getBookingById(req.params.id);
  if (!myBooking) {
    return res.status(400).json(response({ status: 'error', statusCode: '400', message: 'Booking not found' }));
  }
  if (myBooking.extraTimeStatus === 'Approved') {
    return res.status(400).json(response({ status: 'error', statusCode: '400', message: 'already-approved' }));
  }
  myBooking.amount = myBooking.amount + myBooking.extraTimeAmount;
  myBooking.extraTimeStatus = 'Approved';
  myBooking.save();

  const message = "You have a extra-time request from accepted";
  const data = {
    message,
    linkId: myBooking._id,
    type: 'extra-time',
    role: 'user',
    receiver: myBooking.user._id,
  }
  const roomId = "user-notification::" + myBooking.user._id.toString();
  await sendNotification(data, roomId);

  return res.status(200).json(response({ status: 'OK', statusCode: '200', message: 'booking-updated', data: myBooking }));
});

const giveTip = catchAsync(async (req, res) => {
  const myBooking = await getBookingById(req.params.id);
  if (!myBooking) {
    return res.status(400).json(response({ status: 'error', statusCode: '400', message: 'Booking not found' }));
  }
  if (myBooking.tipStatus === 'Given') {
    return res.status(400).json(response({ status: 'error', statusCode: '400', message: 'already-provided' }));
  }
  myBooking.amount = myBooking.amount + Number(req.body.tip) || 0;
  myBooking.tipStatus = 'Given';
  myBooking.save();

  const userAmount = Math.ceil((Number(req.body.tip) || 0)*0.90);
  await addWallet({ snapper: myBooking.snapper, amountAvailable: userAmount });

  const message = "You have been tipped " + req.body.tip + " by " + myBooking.user.fullName + ".";
  const data = {
    message,
    linkId: myBooking._id,
    type: 'extra-time',
    role: 'user',
    receiver: myBooking.user._id,
  }
  const roomId = "user-notification::" + myBooking.user._id.toString();
  await sendNotification(data, roomId);

  return res.status(200).json(response({ status: 'OK', statusCode: '200', message: 'booking-updated', data: myBooking }));
})

module.exports = { addNewBooking, getAllBookings, updateAnBookingBysnapper, updateAnBooking, getAllBookingsForsnapper, getBookingDetails, startBookingBysnapper, completeBookingBysnapper, requestExtraTime, acceptRequestExtraTime, giveTip }