const User = require('../User/user.model');
const Review = require('../Review/review.model');
const PaymentData = require('../PaymentData/paymentData.model');
const { getAverageReviews } = require('../Review/review.service');

const getCustomerCountsAndTotalPayment = async () => {
  const totalUsers = await User.countDocuments({role: 'user'});
  const totalConsulting = await User.countDocuments({role: 'snapper'});
  const totalPayment = await PaymentData.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);
  return {
    totalUsers,
    totalConsulting,
    totalPayment: totalPayment.length ? totalPayment[0].totalAmount : 0
  }
}

module.exports = {
  getCustomerCountsAndTotalPayment
}
