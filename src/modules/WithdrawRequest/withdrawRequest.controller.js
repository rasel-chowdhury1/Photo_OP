const catchAsync = require('../../helpers/catchAsync');
const sendNotification = require('../../helpers/formatNotification');
const response = require("../../helpers/response");
const { getWallet } = require('../Wallet/wallet.service');
const { addWithdrawRequest, getWithdrawRequests, updateWithdrawRequest, getWithdrawRequestsById } = require('./withdrawRequest.service');

const addNewWithdrawRequests = catchAsync(async (req, res) => {
  req.body.user = req.body.userId;
  const withdrawRequestStatus = await addWithdrawRequest(req.body);
  // send notification to admin
  const message = "You have a new Withdraw request from " + req.body.userFullName;
  const data = {
    message,
    linkId: withdrawRequestStatus._id,
    type: 'withdraw-request',
    role: 'admin'
  }
  const roomId = process.env.ADMIN_NOTFICATION_ENDPOINT;
  await sendNotification(data, roomId);

  return res.status(201).json(response({ status: 'OK', statusCode: '201', type: 'withdrawRequest', message: req.t('withdrawRequest-added'), data: withdrawRequestStatus }));
});

const editWithdrawRequests = catchAsync( async (req, res)=> {
  const existingWithRequest = await getWithdrawRequestsById({ _id: req.params.id });
  if(!existingWithRequest){
    return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'withdrawRequest', message: req.t('withdrawRequest-not-found') }));
  }
  if(existingWithRequest.status === req.body.status){
    return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'withdrawRequest', message: req.t('withdrawRequest-same-status') }));
  }
  existingWithRequest.status = req.body.status;
  await existingWithRequest.save();
  if(existingWithRequest && req.body.status === 'Approved'){
    //deduct the amount from the wallet
    let wallet = await getWallet(existingWithRequest.user);
    wallet.amountAvailable = wallet.amountAvailable - existingWithRequest.amount;
    await wallet.save();

    // send notification to snapper
    const message = "Your Withdraw request of $" + existingWithRequest.amount + " has been approved";
    const data = {
      message,
      linkId: existingWithRequest._id,
      type: 'withdraw-request',
      role: 'user',
      receiver: existingWithRequest?.user,
    }
    const roomId = "user-notification::" + existingWithRequest?.user.toString();
    await sendNotification(data, roomId);
  }
  else{
    // send notification to admin
    const message = "Your Withdraw request of $" + existingWithRequest.amount + " has been rejected";
    const data = {
      message,
      linkId: existingWithRequest._id,
      type: 'withdraw-request',
      role: 'user',
      receiver: existingWithRequest?.user,
    }
    const roomId = "user-notification::" + existingWithRequest?.user.toString();
    await sendNotification(data, roomId);
  }
  return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'withdrawRequest', message: req.t('withdrawRequest-updated'), data: existingWithRequest }));
})

const getAllWithdrawRequests = catchAsync(async (req, res)=>{
  const options = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10
  }
  let filter = {};

  if(req.body.userRole === 'user'){
    filter.user = req.body.userId;
  }
  const withdrawRequests = await getWithdrawRequests(filter,options);
  return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'withdrawRequest', message: req.t('withdrawRequest-list'), data: withdrawRequests }));
})

module.exports = { addNewWithdrawRequests, editWithdrawRequests, getAllWithdrawRequests }