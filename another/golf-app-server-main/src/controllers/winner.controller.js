const httpStatus = require("http-status");
const { winnerService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");


const showAllWinnerResultForTournament=catchAsync(async(req,res)=>{

    const userId=req.user._id
    const {id}=req.query

    const result=await winnerService.showAllWinnerResultForTournament(userId,id)
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
const updateTournamentForShowPalyer=catchAsync(async(req,res)=>{

    const userId=req.user._id
    const {id}=req.query

    const result=await winnerService.updateTournamentForShowPalyer(id)
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
    showAllWinnerResultForTournament,
    updateTournamentForShowPalyer
}