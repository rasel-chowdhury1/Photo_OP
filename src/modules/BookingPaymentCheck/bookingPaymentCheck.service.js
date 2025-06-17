const BookingPaymentCheck = require('./bookingPaymentCheck.model');

const addBookingPaymentCheck = async (bookingPaymentCheckBody) => {
  let existingBookingPaymentCheck = await findBookingPaymentChecks(bookingPaymentCheckBody);
  if (existingBookingPaymentCheck) {
    Object.assign(existingBookingPaymentCheck, bookingPaymentCheckBody);
  }
  else {
    existingBookingPaymentCheck = new BookingPaymentCheck(bookingPaymentCheckBody);
  }
  return await existingBookingPaymentCheck.save();
}

const findBookingPaymentChecks = async (bookingPaymentCheckBody) => {
  return await BookingPaymentCheck.findOne({booking: bookingPaymentCheckBody.booking});
}

const getBookingPaymentChecks = async () => {
  return await BookingPaymentCheck.find({paymentLastTime: {$lte: new Date()}}).populate('booking').populate('consultant', 'fullName').populate('user', 'fullName').limit(20);
};

const deleteBookingPaymentCheck = async (id) => {
  return await BookingPaymentCheck.findByIdAndDelete(id);
};

module.exports = {
  addBookingPaymentCheck,
  getBookingPaymentChecks,
  deleteBookingPaymentCheck
};
