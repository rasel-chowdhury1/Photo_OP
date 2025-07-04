
const httpStatus = require("http-status");
const { lookingtoPlayService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");

// looking to play controller create 
//------------------------------------------------------------------------------
const lookingToPlayCreate=catchAsync(async(req,res)=>{
    const userId=req.user._id

    const result =await lookingtoPlayService.lookingToPlayCreate(userId,req.body)

// Return success response
  res.status(httpStatus.OK).json(
    response({
      message: "looking to played created successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
})
// looking to play controller create 
//------------------------------------------------------------------------------
const showAllLookingToPlay=catchAsync(async(req,res)=>{
    const userId=req.user._id

    const result =await lookingtoPlayService.showAllLookingToPlay()

// Return success response
  res.status(httpStatus.OK).json(
    response({
      message: "looking to played show all successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
})

// looking to play controller create 
//------------------------------------------------------------------------------
const showAllTournament=catchAsync(async(req,res)=>{
    const userId=req.user._id

    const result =await lookingtoPlayService.showAllTournament(userId)

// Return success response
  res.status(httpStatus.OK).json(
    response({
      message: "looking to played show all successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
})

module.exports={
    lookingToPlayCreate,
    showAllLookingToPlay,
    showAllTournament
}