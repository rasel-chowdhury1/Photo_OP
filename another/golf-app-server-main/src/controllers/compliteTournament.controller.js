
const httpStatus = require("http-status");
const { compliteCournamnetService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");




// show all complite tournament 
//-------------------------------------------
const showAllCompliteTournament=catchAsync(async(req,res)=>{

    const id=req.user._id

    const result =await compliteCournamnetService.showAllCompliteTournament(id)
    // Return the success response
    res.status(httpStatus.OK).json(
        response({
          message: " show all the complite tournament ",
          status: "OK",
          statusCode: httpStatus.OK,
          data: result,
        })
      );

})

module.exports={
    showAllCompliteTournament
}