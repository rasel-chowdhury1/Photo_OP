const { getBookingPaymentChecks, deleteBookingPaymentCheck } = require('../../modules/BookingPaymentCheck/bookingPaymentCheck.service');
const { updateAnBooking } = require('../../modules/Booking/booking.controller');
const { addNotification } = require('../../modules/Notification/notification.service');

const checkPaymentStatus = async (agenda, io) => {
  agenda.define('check payment status', async job => {
    try {
      const checkForPaymentStatus = await getBookingPaymentChecks();
      if (checkForPaymentStatus && checkForPaymentStatus.length > 0) {
        for (const data of checkForPaymentStatus) {
          if (data.booking.paymentStatus === 'Paid') {
            console.log('💲Payment already done for booking:', data.booking._id);
          } else {
            await updateAnBooking(data.booking._id, { status: 'Cancelled' });
            const notificationData = {
              message: `Your booking with ${data.snapper.fullName} has been cancelled due to non-payment of fees.`,
              receiver: data.user,
              type: 'booking',
              link: data.booking._id,
              role: 'user',
              receiver: data.user._id,
            };
            const newNotification = await addNotification(notificationData);
            const roomId = 'user-notification::' + data.user._id.toString

            // Emit the socket event
            io.emit(roomId, newNotification);
          }
          await deleteBookingPaymentCheck(data._id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = checkPaymentStatus;
