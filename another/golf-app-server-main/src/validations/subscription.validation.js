const Joi = require("joi");

const subscriptionValidation = {
  body: Joi.object().keys({
    subscriptionType: Joi.string().valid('basicUser', 'superUser').required(),  // Validate if it's either basicUser or superUser
    stripeSubscriptionId: Joi.string().required(),  // Stripe Subscription ID
    stripeCustomerId: Joi.string().required(),  // Stripe Customer ID
    planType: Joi.string().required(),  // Stripe Customer ID
    status: Joi.string().valid('active', 'inactive', 'canceled').optional(),  // Status can be active, inactive, or canceled
    planPrice: Joi.number().positive().required(),  // Subscription price
    paymentMethod: Joi.string().valid('credit_card', 'paypal').required(),  // Payment method (credit card or PayPal)
    startDate: Joi.date().default(Date.now),  // Start date (default to now if not provided)
    endDate: Joi.date().optional(),  // Expiration date (if applicable)
    lastPaymentDate: Joi.date().optional(),  // Last payment date (optional)
  }),
};

module.exports = {
  subscriptionValidation,
};
