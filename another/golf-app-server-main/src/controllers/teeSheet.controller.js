const httpStatus = require("http-status");
const { teeSheetService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");



// create teesheet controller 
//-----------------------------------------------------------
const createTeeSheet=catchAsync(async(req,res)=>{

  const userId=req.user._id 

    const result=await teeSheetService.createTeeSheet(req.body,userId)
    
     // Return the success response
     res.status(httpStatus.CREATED).json(
        response({
          message: "make the request succefully",
          status: "OK",
          statusCode: httpStatus.CREATED,
          data: result,
         
        })
      );

})


// show my tourneament by the name
//-----------------------------------------------
const showMyTournament=catchAsync(async(req,res)=>{

    const userId=req.user._id
    const {name}=req.query

    const result=await teeSheetService.showMyTournament(name,userId)
    
     // Return the success response
     res.status(httpStatus.OK).json(
        response({
          message: "make the request succefully",
          status: "OK",
          statusCode: httpStatus.OK,
          data: result,
         
        })
      );

})

// show my tournaemnt by the id 
//-------------------------------------------
const showTournamentById=catchAsync(async(req,res)=>{
  const {id,typeName}=req.query
  const result=await teeSheetService.showTournamentById(id,typeName)
    
     // Return the success response
     res.status(httpStatus.OK).json(
        response({
          message: "show turanemtn by id ",
          status: "OK",
          statusCode: httpStatus.OK,
          data: result,
         
        })
      );



})

// show theshet for the specfice tournament 
//------------------------------------------------------
const showAllTeesheetByTournamentId=catchAsync(async(req,res)=>{
 
  const {id}=req.query
  const result =await teeSheetService.showAllTeesheetByTournamentId(id)
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
    createTeeSheet,
    showMyTournament,
    showTournamentById,
    showAllTeesheetByTournamentId
}