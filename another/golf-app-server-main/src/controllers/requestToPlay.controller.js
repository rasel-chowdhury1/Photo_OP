const httpStatus = require("http-status");
const { requestToPlayService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const pagination = require("../utils/pagination");
const response = require("../config/response");





const makeRequestToplay=catchAsync(async(req,res)=>{

    const id=req.user._id
   const {tournamentId,typename}=req.body

    const result=await requestToPlayService.makeRequestToplay(id,tournamentId,typename)

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

const showAllrequestedtournament=catchAsync(async(req,res)=>{
    const id=req.user._id
    const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 100;
    

    const {typename,}=req.query
    console.log(typename,id);
    const {requeist,requestCount}=await requestToPlayService.showAllrequestedtournament(id,typename,page,limit)

    


    // Generate pagination data
const toruanmentPaginate = pagination(requestCount, limit, page);


    // Return the success response
    res.status(httpStatus.OK).json(
        {
      message: "show all  the request succefully",
          status: "OK",
          statusCode: httpStatus.OK,
          data: requeist,
          pagination:toruanmentPaginate
         
        }
      );
})

const showAllRequiestedTouranamentById=catchAsync(async(req,res)=>{
    const {id}=req.params

    const result=await requestToPlayService.showrequestDetalsById(id)
   

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


// aproved the user the who requested for the play
//--------------------------------------------------------------------------------
const aprovedTheRequest=catchAsync(async(req,res)=>{

    const {id}=req.query
    const result =await requestToPlayService.aprovedTheReques(id)
    console.log(result);
     // Return the success response
     res.status(httpStatus.OK).json(
        response({
          message: "make the request aproved ",
          status: "OK",
          statusCode: httpStatus.OK,
          data: result,
         
        })
      );
})

// aproved the user the who requested for the play
//--------------------------------------------------------------------------------
const cancelRequest=catchAsync(async(req,res)=>{
    const {id}=req.query
    console.log(id);
    const result =await requestToPlayService.cancelRequest(id)
    console.log(result);
     // Return the success response
     res.status(httpStatus.OK).json(
        response({
          message: "tournament creator are cancel your request ",
          status: "OK",
          statusCode: httpStatus.OK,
          data: result,
         
        })
      );
})
module.exports={
    makeRequestToplay,
    showAllrequestedtournament,
    showAllRequiestedTouranamentById,
    aprovedTheRequest,
    cancelRequest
}