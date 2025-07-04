const { Notification } = require("../models");


/**
 * Send a notification to a user
 * @param {Object} options - Notification options
 * @param {String} options.sender - The user ID who triggered the notification
 * @param {String} options.receiver - The user ID who will receive the notification
 * @param {String} options.title - Title of the notification
 * @param {String} options.body - Message body of the notification
 * @param {String} options.type - Type of notification ("payment", "tournament", "update", "general")
 * @param {String} [options.tournamentId] - Optional tournament ID for tournament-related notifications
 * @param {String} [options.paymentId] - Optional payment ID for payment-related notifications
 * @param {String} [options.linkId] - Optional link to redirect user to a specific page
 */
const sendNotification = async ({
  sender,
  receiver,
  title,
  body,
  type = "general",
  tournamentId = null,
  paymentId = null,
  linkId = null
}) => {
  try {
    const notification = new Notification({
      sender,
      receiver,
      tournamentId,
      paymentId,
      title,
      body,
      type,
      linkId,
      isRead: false
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw new Error("Failed to send notification");
  }
};

module.exports = {
  sendNotification
};
