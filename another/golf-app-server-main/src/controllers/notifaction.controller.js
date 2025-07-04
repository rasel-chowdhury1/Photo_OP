
const httpStatus = require("http-status");
const { notificationService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const pagination = require("../utils/pagination");
const response = require("../config/response");


// get all the notifaction by the user 
//---------------------------------------------------------------------

const getAllNotifaction=catchAsync(async(req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
  

    const userId=req.user._id
    const {allNotifaction,totalNotifactio}=await  notificationService.getAllNotifaction(userId,page,limit)
    console.log(userId,allNotifaction);

    // Generate pagination data
const notifactionPaginate = pagination(totalNotifactio, limit, page);
    // Return the success response
    res.status(httpStatus.OK).json(
        response({
          message: "all the notifaction are fetched",
          status: "OK",
          statusCode: httpStatus.OK,
          data: allNotifaction,
          pagination:notifactionPaginate
        })
      );
})


const markAsRead=catchAsync(async(req,res)=>{
    const {id}=req.query

    const result=await notificationService.markAsRead(id)
    // Return the success response
    res.status(httpStatus.OK).json(
        response({
          message: "notifacion read successfully",
          status: "OK",
          statusCode: httpStatus.OK,
          data: result,
         
        })
      );

})

module.exports={
    getAllNotifaction,
    markAsRead
}