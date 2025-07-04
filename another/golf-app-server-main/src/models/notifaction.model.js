const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: false 
  }, // Recipient's user ID (e.g., the player or organizer)
  
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: false 
  }, // Optional: Some notifications might involve multiple users (e.g., tournaments with organizers/players)
  
  tournamentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Tournament", 
    required: false 
  }, // Tournament ID for tournament-specific notifications

  
  paymentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Payment", 
    required: false 
  }, // Link to a payment record, if payment-related notification

  title: { 
    type: String, 
    required: true 
  }, // Notification title

  body: { 
    type: String, 
    required: true 
  }, // Notification message

  
  linkId: { 
    type: String, 
    required: false 
  }, // A link that directs to the relevant tournament, booking, or user profile

  type: { 
    type: String, 
    enum: ["payment", "general",  "tournament", "update","subscription"], 
    default: "general" 
  }, // Type of notification (added 'tournament' for tournament-specific notifications)

  metadata: { 
    type: mongoose.Schema.Types.Mixed, 
    required: false 
  }, // Additional data like tournament details, player info, or payment status

  isRead: { 
    type: Boolean, 
    default: false 
  }, // Read status (default: false)

}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
