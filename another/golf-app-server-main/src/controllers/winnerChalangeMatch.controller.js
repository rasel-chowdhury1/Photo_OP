

const httpStatus = require("http-status");

const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const {  winnerChalangeMatchService } = require("../services");



// create skin winner controller 
//----------------------------------------------------------------------------
const winnerChalangeMatchcreate=catchAsync(async(req,res)=>{
  const userId=req.user._id
    const body=req.body

     const result=await winnerChalangeMatchService.winnerChalangeMatchcreate(body,userId)
        // Return the success response
        res.status(httpStatus.CREATED).json(
            response({
              message: "created winner chalange metch successfully",
              status: "OK",
              statusCode: httpStatus.CREATED,
              data: result,
             
            })
          );

})

// show all the user of skin 
//---------------------------------------------------
const showAllUserforChalangeMatch=catchAsync(async(req,res)=>{
    const {id}=req.query
    const result=await winnerChalangeMatchService.showAllUserforChalangeMatch(id)
    console.log(result);
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
    showAllUserforChalangeMatch,
    winnerChalangeMatchcreate
}