

const httpStatus = require("http-status");

const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { winnerKpsService } = require("../services");



// create skin winner controller 
//----------------------------------------------------------------------------
const winnerKpscreate=catchAsync(async(req,res)=>{

  const userId=req.user._id
    const body=req.body

     const result=await winnerKpsService.winnerKpscreate(body,userId)
        // Return the success response
        res.status(httpStatus.CREATED).json(
            response({
              message: "created winner skin successfully",
              status: "OK",
              statusCode: httpStatus.CREATED,
              data: result,
             
            })
          );

})

// show all the user of skin 
//---------------------------------------------------
const showAllUserForKps=catchAsync(async(req,res)=>{
    const {id}=req.query
    const result=await winnerKpsService.showAllUserForKps(id)
    // Return the success response
    res.status(httpStatus.OK).json(
        response({
          message: "show  all user successfully",
          status: "OK",
          statusCode: httpStatus.OK,
          data: result,
         
        })
      );
})


module.exports={
    winnerKpscreate,
    showAllUserForKps
}