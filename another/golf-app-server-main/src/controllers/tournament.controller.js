const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { tournamentService, tournamentCoursService, userService } = require("../services");
const response = require("../config/response");
const pagination = require("../utils/pagination");

/**
 * Create a new tournament
 */
const createTournament = catchAsync(async (req, res) => {

  const id=req.user._id
  console.log(id);

  const tournamentImage = {};


  if (req.file) {
    tournamentImage.url = "/uploads/tournament/big/" + req.file.filename;
    tournamentImage.path = req.file.path;
  }
  if (req.file) {
    req.body.tournamentImage = tournamentImage;
  }
 
  const tournament = await tournamentService.createTournament(req.body,id);
  // Prepare the data object with proper coordinates
  const data = {
    slopeRating:req.body.slopeRating,
    courseRating:req.body.courseRating,
    courseName:req.body.courseName,

     // Spread the tournamentBody object
    courseLocation: {
      coordinates: [req.body.longitude, req.body.latitude], // Corrected names
    }
  }

  await tournamentCoursService.createTournamentCoursSerivce(data)



  res.status(httpStatus.CREATED).json(
    response({
      message: "Tournament Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: tournament,
    })
  );
});



// get tournament for the user by 60 km location 
//-------------------------------------------------------------------------------
const getTournaments = catchAsync(async (req, res) => {
  const id = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;

  

  // Fetch user data
  const user = await userService.getUserById(id);
  // Call service to get tournaments with pagination
  const { tournamentsWithDistance, totalCount } = await tournamentService.getTournaments(user, limit, page);

  // Generate pagination data
  const toruanmentPaginate = pagination(totalCount, limit, page);

  res.status(httpStatus.OK).json(
    {
      message: "Tournaments Retrieved",
      status: "OK",
      statusCode: httpStatus.OK,
      data: tournamentsWithDistance,
      pagination: toruanmentPaginate,  // Include pagination info
    }
  );
});

/**
 * Get tournament by ID
 */
const getTournamentById = catchAsync(async (req, res) => {
  const { tournamentId } = req.params;
  const tournament = await tournamentService.getTournamentById(tournamentId);
  
  if (!tournament) {
    throw new ApiError(httpStatus.NOT_FOUND, "Tournament not found");
  }
  
  res.status(httpStatus.OK).json(
    response({
      message: "Tournament Retrieved",
      status: "OK",
      statusCode: httpStatus.OK,
      data: tournament,
    })
  );
});

/**
 * Update a tournament
 */
const updateTournament = catchAsync(async (req, res) => {
  const { tournamentId } = req.params;
  const tournament = await tournamentService.updateTournament(tournamentId, req.body);
  
  if (!tournament) {
    throw new ApiError(httpStatus.NOT_FOUND, "Tournament not found");
  }
  
  res.status(httpStatus.OK).json(
    response({
      message: "Tournament Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: tournament,
    })
  );
});

/**
 * Delete a tournament by ID
 */
const deleteTournament = catchAsync(async (req, res) => {
  const { tournamentId } = req.params;
  const tournament = await tournamentService.deleteTournament(tournamentId);
  
  if (!tournament) {
    throw new ApiError(httpStatus.NOT_FOUND, "Tournament not found");
  }
  
  res.status(httpStatus.OK).json(
    response({
      message: "Tournament Deleted",
      status: "OK",
      statusCode: httpStatus.OK,
    })
  );
});


// tourneament request by the user 
//-----------------------------------------------------------------
const makeRequiestToPlay=catchAsync(async(req,res)=>{
  const {id}=req.query
  const userId=req.user._id

  const result=await tournamentService.makeRequestToPlay(id,userId)

   // Return the success response
   res.status(httpStatus.OK).json(
    response({
      message: "User Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );


})


// admin for the tournament 
//------------------------------------------

// requiested play my new tournament 
  //------------------------------------------------------------------------------
  const showAllMyTournanmnetForRequest=catchAsync(async(req,res)=>{
    

    const result =await tournamentService.showAllMyTournanmnetForRequest()

     // Return the success response
     res.status(httpStatus.OK).json(
      response({
        message: "show all requested  tournament ",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  })
  // requiested play my new tournament 
  //------------------------------------------------------------------------------
  const showAllTournanmnetForRequestAproved=catchAsync(async(req,res)=>{

    const {id}=req.query
    

    const result =await tournamentService.showAllTournanmnetForRequestAproved(id)

     // Return the success response
     res.status(httpStatus.OK).json(
      response({
        message: " requested  tournament  are aproved",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  })
  // requiested play my new tournament 
  //------------------------------------------------------------------------------
  const showAllMyTournanmnetForRequestRejected=catchAsync(async(req,res)=>{

    const {id}=req.query
    

    const result =await tournamentService.showAllMyTournanmnetForRequestRejected(id)

     // Return the success response
     res.status(httpStatus.OK).json(
      response({
        message: " requested  tournament are rejected ",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  })
  // requiested play my new tournament 
  //------------------------------------------------------------------------------
  const showallAprovedTourmant=catchAsync(async(req,res)=>{
    

    const result =await tournamentService.showallAprovedTourmant()

     // Return the success response
     res.status(httpStatus.OK).json(
      response({
        message: " show all approved toruanent",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  })
  // requiested play my new tournament 
  //------------------------------------------------------------------------------
  const showallRejectTourmant=catchAsync(async(req,res)=>{


    

    const result =await tournamentService.showallRejectTourmant()

     // Return the success response
     res.status(httpStatus.OK).json(
      response({
        message: " show all reejcet toruament  ",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  })

module.exports = {
  createTournament,
  getTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
  makeRequiestToPlay,
  showallRejectTourmant,
  showallAprovedTourmant,
  showAllMyTournanmnetForRequestRejected,
  showAllTournanmnetForRequestAproved,
  showAllMyTournanmnetForRequest,
  
};
