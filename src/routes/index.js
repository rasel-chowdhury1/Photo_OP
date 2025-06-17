const express = require('express');

const router = express.Router();

const userRoutes = require('../modules/User/user.route');
const portfolioRoutes = require('../modules/Portfolio/portfolio.route');
const bookingRoutes = require('../modules/Booking/booking.route');
const termsAndConditionsRoutes = require('../modules/TermsAndCondition/termsAndCondition.route');
const privacyPolicyRoutes = require('../modules/PrivacyPolicy/privacyPolicy.route');
const faqRoutes = require('../modules/Faq/faq.route');
const aboutUsRoutes = require('../modules/AboutUs/aboutUs.route');
const reviewRoutes = require('../modules/Review/review.route');
const dashboardRoutes = require('../modules/Dashboard/dashboard.route');
const withdrawRequestRoutes = require('../modules/WithdrawRequest/withdrawRequest.route');
const paymentDataRoutes = require('../modules/PaymentData/paymentData.route');
const walletRoutes = require('../modules/Wallet/wallet.route');
const notificationRoutes = require('../modules/Notification/notification.route');
const chatRoutes = require('../modules/Chat/chat.route');
const messageRoutes = require('../modules/Message/message.route');
const picUploadRoutes = require('../modules/PicUpload/picUpload.route');

const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/portfolios',
    route: portfolioRoutes,
  },
  {
    path: '/bookings',
    route: bookingRoutes,
  },
  {
    path: '/terms-and-conditions',
    route: termsAndConditionsRoutes,
  },
  {
    path: '/privacy-policies',
    route: privacyPolicyRoutes,
  },
  {
    path: '/about-us',
    route: aboutUsRoutes,
  },
  {
    path: '/faqs',
    route: faqRoutes,
  },
  {
    path: '/reviews',
    route: reviewRoutes,
  },
  {
    path: '/dashboards',
    route: dashboardRoutes,
  },
  {
    path: '/withdraw-requests',
    route: withdrawRequestRoutes,
  },
  {
    path: '/payment-data',
    route: paymentDataRoutes,
  },
  {
    path: '/wallets',
    route: walletRoutes,
  },
  {
    path: '/notifications',
    route: notificationRoutes,
  },
  {
    path: '/chats',
    route: chatRoutes,
  },
  {
    path: '/messages',
    route: messageRoutes,
  },
  {
    path: '/pic-uploads',
    route: picUploadRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

module.exports = router;