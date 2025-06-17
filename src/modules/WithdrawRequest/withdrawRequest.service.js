const WithdrawRequest = require('./withdrawRequest.model');

const addWithdrawRequest = async (WithdrawRequestBody) => {
  const newWithdrawReq = new WithdrawRequest(WithdrawRequestBody);
  return await newWithdrawReq.save();
}

const updateWithdrawRequest = async (paymentId, updateData) => {
  return await WithdrawRequest.findByIdAndUpdate(paymentId, updateData, { new: true });
}

const getWithdrawRequests = async (filter, options) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;
  const WithdrawRequests = await WithdrawRequest.find(filter).skip(skip).limit(limit).populate('user', 'fullName image email');
  const totalResults = await WithdrawRequest.countDocuments(filter);
  const totalPages = Math.ceil(totalResults / limit);
  const pagination = { currentPage: page, limit, totalResults, totalPages };
  return { WithdrawRequests, pagination };
}

const getWithdrawRequestsById = async (id) => {
  return await WithdrawRequest.findById(id)
}

module.exports = {
  addWithdrawRequest,
  updateWithdrawRequest,
  getWithdrawRequests,
  getWithdrawRequestsById
}
