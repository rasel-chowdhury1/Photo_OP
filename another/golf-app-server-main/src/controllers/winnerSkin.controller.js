const httpStatus = require("http-status");
const { winnerSkinService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");



// create skin winner controller 
//----------------------------------------------------------------------------
const winnerSkincreate=catchAsync(async(req,res)=>{
const userId=req.user._id
    const body=req.body

     const result=await winnerSkinService.winnerSkincreate(body,userId)
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
const showAllUserForSkin=catchAsync(async(req,res)=>{
    const {id}=req.query
    const result=await winnerSkinService.showAllUserForSkin(id)
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
// show all the user of skin 
//---------------------------------------------------
const updateWinnerSkin=catchAsync(async(req,res)=>{
    const {userId}=req.user._id
    const data=req.body
    const result=await winnerSkinService.updateWinnerSkin(data, userId)
    // Return the success response
    res.status(httpStatus.OK).json(
        response({
          message: "update the winner skin  successfully",
          status: "OK",
          statusCode: httpStatus.OK,
          data: result,
         
        })
      );
})


module.exports={
    winnerSkincreate,
    showAllUserForSkin,
    updateWinnerSkin
}