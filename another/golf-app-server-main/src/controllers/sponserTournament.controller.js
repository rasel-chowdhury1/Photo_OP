const httpStatus = require("http-status");
const { sponserTournamentService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");


// create sponser tourment 
//---------------------------------------------------------------------------------------
const createSponserTournament=catchAsync(async(req,res)=>{
    const userId=req.user._id

    const sponserImage = {};


    if (req.file) {
      sponserImage.url = "/uploads/tournament/big/" + req.file.filename;
      sponserImage.path = req.file.path;
    }
    if (req.file) {
      req.body.sponserImage = sponserImage;
    }
    
    const result =await sponserTournamentService.createSponserTournament(userId,req.body)

     // Return the success response
     res.status(httpStatus.OK).json(
      response({
        message: "requested small tournament  are aproved",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );

})
const updateSponserTournament = catchAsync(async (req, res) => {
  const { sponserId } = req.query; // Get ID from params
  const userId = req.user._id; // Get user ID from authentication middleware

  // Handle Image Upload (if any)
  if (req.file) {
    req.body.sponserImage = {
      url: "/uploads/tournament/big/" + req.file.filename,
      path: req.file.path,
    };
  }

  // Update sponsor tournament
  const result = await sponserTournamentService.updateSponserTournament(sponserId, req.body);
  

  // If tournament not found
  if (!result) {
    return res.status(httpStatus.NOT_FOUND).json(
      response({
        message: "Sponsor tournament not found",
        status: "ERROR",
        statusCode: httpStatus.NOT_FOUND,
        data: null,
      })
    );
  }

  // Return success response
  res.status(httpStatus.OK).json(
    response({
      message: "Sponsor tournament updated successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});


// show the sponser tournament by location of users
//-------------------------------------------------------------------------
const showAllsponserTournament=catchAsync(async(req,res)=>{

  const userId=req.user._id

  const result =await sponserTournamentService.showAllsponserTournament(userId)

  // Return the success response
  res.status(httpStatus.OK).json(
   response({
     message: "requested small tournament  are aproved",
     status: "OK",
     statusCode: httpStatus.OK,
     data: result,
   })
 );


})


module.exports={
    createSponserTournament,
    showAllsponserTournament,
    updateSponserTournament
}