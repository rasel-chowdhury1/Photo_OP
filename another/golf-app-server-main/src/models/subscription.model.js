

const mongoose = require('mongoose');

// Define the subscription schema
const subscriptionSchema = new mongoose.Schema(
  {
    subscribUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subscriptionType: { 
      type: String, 
      enum: ['basicUser', 'superUser'], 
      required: true 
    },
    stripeSubscriptionId: { type: String, required: true },  
    stripeCustomerId: { type: String, required: true },  
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'canceled'], 
      default: 'active' 
    },
    startDate: { type: Date, default: Date.now },  
    endDate: { type: Date, required: false },  
    planPrice: { type: Number, required: true }, 
    planType: { type: String, enum:["month","year"], required: true }, 
    paymentMethod: { 
      type: String, 
      enum: ['credit_card', 'paypal'], 
      required: true 
    },
    lastPaymentDate: { type: Date },  
    reminderSent: { type: Boolean, default: false }, // Track if a reminder was sent
    isApproved: { type: Boolean, default: false } // Track if a reminder was sent
  },
  { timestamps: true }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
