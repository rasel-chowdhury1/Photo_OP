const httpStatus = require("http-status");
const { smallTournamentService, tournamentCoursService, userService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const pagination = require("../utils/pagination");


// small tornament create controller
//------------------------------------------------------------------------------

const createSmmallTournament=catchAsync(async(req,res)=>{

    const id=req.user._id

    
  const tournamentImage = {};


  if (req.file) {
    tournamentImage.url = "/uploads/tournament/big/" + req.file.filename;
    tournamentImage.path = req.file.path;
  }
  if (req.file) {
    req.body.tournamentImage = tournamentImage;
  }

  const smalltournament = await smallTournamentService.createSmmallTournament(req.body,id);
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
      data: smalltournament,
    })
  );
});

// small tornament get all sournament controller
//------------------------------------------------------------------------------
const getAllsmallTournament=catchAsync(async(req,res)=>{

    const id = req.user._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 100;
    
      
    
      // Fetch user data
      const user = await userService.getUserById(id);


  // Call service to get tournaments with pagination
  const { tournamentsWithDistance, totalCount } = await smallTournamentService.getAllsmallTournament(user, limit, page);    
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

const getSmallTournamentById = catchAsync(async (req, res) => {
    const { tournamentId } = req.params;
    const tournament = await smallTournamentService.getSmallTournamentById(tournamentId);
    
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


  // tourneament request by the user 
//-----------------------------------------------------------------
const makeRequiestToPlay=catchAsync(async(req,res)=>{
    const {id}=req.query
    const userId=req.user._id
    console.log(id);

    const result=await smallTournamentService.makeRequestToPlay(id,userId)
  
     // Return the success response
     res.status(httpStatus.OK).json(
      response({
        message: "User requiested to play",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  
  
  })

  // requiested play my new tournament 
  //------------------------------------------------------------------------------
  const showAllMySmallTournanmnetForRequest=catchAsync(async(req,res)=>{
    

    const result =await smallTournamentService.showAllMySmallTournanmnetForRequest()

     // Return the success response
     res.status(httpStatus.OK).json(
      response({
        message: "show all requested small tournament ",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  })
  // requiested play my new tournament 
  //------------------------------------------------------------------------------
  const showAllMySmallTournanmnetForRequestAproved=catchAsync(async(req,res)=>{

    const {id}=req.query
    

    const result =await smallTournamentService.showAllMySmallTournanmnetForRequestAproved(id)

     // Return the success response
     res.status(httpStatus.OK).json(
      response({
        message: " requested small tournament  are aproved",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  })
  // requiested play my new tournament 
  //------------------------------------------------------------------------------
  const showAllMySmallTournanmnetForRequestRejected=catchAsync(async(req,res)=>{

    const {id}=req.query
    

    const result =await smallTournamentService.showAllMySmallTournanmnetForRequestRejected(id)

     // Return the success response
     res.status(httpStatus.OK).json(
      response({
        message: " requested small tournament are rejected ",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  })
  // requiested play my new tournament 
  //------------------------------------------------------------------------------
  const showallAprovedsmallTourmant=catchAsync(async(req,res)=>{
    

    const result =await smallTournamentService.showallAprovedsmallTourmant()

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
  const showallRejectsmallTourmant=catchAsync(async(req,res)=>{


    

    const result =await smallTournamentService.showallRejectsmallTourmant()

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
  

  // make the torument compleite
  //----------------------------------------------------------

  const makeTournaemntIsComplite=catchAsync(async(req,res)=>{

    const {id,type}=req.query
    const result =await tournamentCoursService.makeTournaemntIsComplite(id,type)
    console.log( result);

     // Return the success response
     res.status(httpStatus.OK).json(
      response({
        message: " update the tourament   ",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );

  })
  
module.exports={
    createSmmallTournament,
    getAllsmallTournament,
    getSmallTournamentById,
    makeRequiestToPlay,
    showAllMySmallTournanmnetForRequest,
    showAllMySmallTournanmnetForRequestRejected,
    showAllMySmallTournanmnetForRequestAproved,
    showallRejectsmallTourmant,
    showallAprovedsmallTourmant,
    makeTournaemntIsComplite
}