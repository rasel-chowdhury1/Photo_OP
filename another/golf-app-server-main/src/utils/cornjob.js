const cron = require("node-cron");


const Subscription = require("../models/subscription.model");
const { sendEmail } = require("../services/email.service");
require("dotenv").config();

// Function to send reminder email using the centralized email function
const sendReminderEmail = async (userEmail, subscription) => {
    const subject = "Subscription Expiry Reminder";
    const html = `
    <body style="background-color: #f3f4f6; padding: 1rem; font-family: Arial, sans-serif;">
      <div style="max-width: 24rem; margin: 0 auto; background-color: #fff; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h1 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">Subscription Expiry Notice</h1>
        <p style="color: #4b5563; margin-bottom: 1rem;">Your <strong>${subscription.subscriptionType}</strong> subscription will expire on <strong>${subscription.endDate.toDateString()}</strong>.</p>
        <p style="color: #4b5563; margin-bottom: 1rem;">Renew now to continue enjoying our services without interruption.</p>
        <a href="http://link-to-renew-subscription" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Renew Subscription</a>
      </div>
    </body>
    `;
    await sendEmail(userEmail, subject, html);
  };

// Function to start cron job
const startSubscriptionCheck = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running subscription expiry check...");

    const today = new Date();
    const threeDaysAhead = new Date();
    threeDaysAhead.setDate(today.getDate() + 3);

    // Find subscriptions expiring in 3 days
    const expiringSoon = await Subscription.find({
      endDate: { $lte: threeDaysAhead, $gt: today },
      reminderSent: false,
    }).populate("subscribUser", "email");

    for (let subscription of expiringSoon) {
      await sendReminderEmail(subscription.subscribUser.email, subscription);
      subscription.reminderSent = true;
      await subscription.save();
    }

    // Find expired subscriptions and update their status
    await Subscription.updateMany(
      { endDate: { $lte: today }, status: "active" },
      { $set: { status: "inactive" } }
    );

    console.log("Subscription check completed.");
  });
};

module.exports = { startSubscriptionCheck };
