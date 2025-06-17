const express = require('express');
const { addNewBooking, getAllBookings, updateAnBookingBysnapper, updateAnBooking, getAllBookingsForsnapper, getBookingDetails, startBookingBysnapper, completeBookingBysnapper, requestExtraTime, acceptRequestExtraTime, giveTip } = require('./booking.controller');
const router = express.Router();

const { isValidUser } = require('../../middlewares/auth')

//follow routes
router.post('/', isValidUser, addNewBooking);

// spanner all booking routes
router.get('/snapper', isValidUser, getAllBookingsForsnapper);

// user all booking routes
router.get('/', isValidUser, getAllBookings);
router.get('/:id', isValidUser, getBookingDetails);

// accept initial booking by snapper
router.patch('/start/:id', isValidUser, startBookingBysnapper);
router.patch('/complete/:id', isValidUser, completeBookingBysnapper);
// accept extra time by snapper
router.patch('/accept-extra-time/:id', isValidUser, acceptRequestExtraTime);
router.patch('/:id', isValidUser, updateAnBookingBysnapper);
// request extra time by user
router.put('/extra-time/:id', isValidUser, requestExtraTime);
// give tip by user
router.put('/tip/:id', isValidUser, giveTip);
router.put('/:id', isValidUser, updateAnBooking);

module.exports = router;