
const httpStatus = require("http-status");
const { messageService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");

// show all message to my chat 
//------------------------------------------

const showMyChatMessage=catchAsync(async(req,res)=>{

    
    const {chatid}=req.query

    const result=await messageService.showMyChatMessage(chatid)
    // Return success response
  res.status(httpStatus.OK).json(
    response({
      message: "show all message  successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
})

module.exports={
    showMyChatMessage
}