
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { topplayerService } = require("../services");
const response = require("../config/response");

// show all top player by the location in 60 km 

//--------------------------------------------------------------------------
const topplayear=catchAsync(async(req,res)=>{

    const userId=req.user._id

    const result =await topplayerService.topplayear(userId)

     // Return the success response
   res.status(httpStatus.OK).json(
    response({
      message: "show tessheet by the  id ",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
     
    })
  );


})

module.exports={
    topplayear
}