const httpStatus = require('http-status');
const ApiError = require('../../helpers/ApiError');
const Booking = require('./booking.model');

const addBooking = async (bookingBody) => {
  var existingBooking = await findBookingsByUsers(bookingBody);
  if (existingBooking) {
    throw new ApiError(httpStatus.CONFLICT, 'bookinged-exists');
  }
  const booking = new Booking(bookingBody);
  const savedBooking = await booking.save()
  return savedBooking;
}

const findBookingsByUsers = async (bookingBody) => {
  const existingBooking = await Booking.findOne({
    $or: [
      {
        $and: [
          { user: bookingBody.user },
          { startTime: { $gte: bookingBody.startTime } },
          { status: 'Approved' },
        ]
      },
      {
        $and: [
          { snapper: bookingBody.snapper },
          { startTime: { $gte: bookingBody.startTime } },
          { status: 'Approved' },
        ]
      },
      {
        $and: [
          { user: bookingBody.user },
          { snapper: bookingBody.snapper },
          { startTime: bookingBody.startTime },
          { status: 'Pending' },
        ]
      }
    ]
  });
  return existingBooking;
}

const updateBooking = async (bookingId, bookingBody) => {
  return await Booking.findByIdAndUpdate(bookingId, bookingBody, { new: true }).populate('user', 'fullName');
}

const getBookings = async (filter, options) => {
  const { limit, page } = options;
  const skip = limit * (page - 1);
  const bookingList = await Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user', 'fullName email image phoneNumber countryCode').populate('snapper', 'email fullName image phoneNumber countryCode title');
  const totalResults = await Booking.countDocuments(filter);
  const totalPages = Math.ceil(totalResults / limit);
  const pagination = { totalResults, totalPages, currentPage: page, limit };
  return { bookingList, pagination };
}

const getBookingById = async (bookingId) => {
  return await Booking.findById(bookingId).populate('user snapper');
}

module.exports = {
  addBooking,
  findBookingsByUsers,
  updateBooking,
  getBookings,
  getBookingById
};
