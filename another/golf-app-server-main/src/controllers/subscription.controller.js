

const httpStatus = require("http-status");
const { subscriptionService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");



// create subscription for the user
//---------------------------------------------------------------
const createSubscription=catchAsync(async(req,res)=>{

    const userId=req.user._id

    const result=await subscriptionService.createSubscription(userId,req.body)

     // Return the success response
     res.status(httpStatus.CREATED).json(
        response({
          message: "make the request succefully",
          status: "OK",
          statusCode: httpStatus.CREATED,
          data: result,
         
        })
      );

})


// show all subscribe user 
//----------------------------------------------------------
const showAllSubscribeRequestedUser=catchAsync(async(req,res)=>{
  const userId=req.user._id
  const result=await subscriptionService.showAllSubscribeRequestedUser(userId)
    // Return the success response
    res.status(httpStatus.OK).json(
      response({
        message: "show all subscribe user",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
       
      })
    );})
// show all subscribe user 
//----------------------------------------------------------
const showAllSubscribeUser=catchAsync(async(req,res)=>{
  const userId=req.user._id
  const result=await subscriptionService.showAllSubscribeUser(userId)
    // Return the success response
    res.status(httpStatus.OK).json(
      response({
        message: "show all subscribe user",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
       
      })
    );})


// show all subscribe user who are cnseled
//----------------------------------------------------------
const showAllSubscribeUserBlock=catchAsync(async(req,res)=>{
  const userId=req.user._id
  const result=await subscriptionService.showAllSubscribeUserBlock(userId)
    // Return the success response
    res.status(httpStatus.OK).json(
      response({
        message: "show all subscribe user",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
       
      })
    );
  })


// show all subscribe user who are cnseled
//----------------------------------------------------------
const canceledSubscriber=catchAsync(async(req,res)=>{
  const id=req.user._id
  const {subscribUser,subscribeId}=req.query
  const result=await subscriptionService.canceledSubscriber(subscribUser,subscribeId,id)
    // Return the success response
    res.status(httpStatus.OK).json(
      response({
        message: "cancle subscription",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
       
      })
    );
  })
// show all subscribe user who are cnseled
//----------------------------------------------------------
const acceptSubscribUser=catchAsync(async(req,res)=>{

  const id=req.user._id
const {subscribUser,subscribeId}=req.query
  const result=await subscriptionService.acceptSubscribUser(subscribUser,subscribeId,id)
    // Return the success response
    res.status(httpStatus.OK).json(
      response({
        message: "aproved the  subscription",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
       
      })
    );
  })

module.exports={
    createSubscription,
    showAllSubscribeUser,
    showAllSubscribeUserBlock,
    canceledSubscriber,
    acceptSubscribUser,
    showAllSubscribeRequestedUser
}