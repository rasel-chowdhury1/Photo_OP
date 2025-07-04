const httpStatus = require("http-status");

const { subscribService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");


// care subscribe controller 
//------------------------------------------
const createSubcrib=catchAsync(async(req,res)=>{

    const userId=req.user._id
    

    const result =await subscribService.createSubcrib(userId,req.body)
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


// show subcribe
//-------------------------------------------
const showSubscrib=catchAsync(async(req,res)=>{

    const result=await subscribService.showSubscrib()
        // Return the success response
        res.status(httpStatus.OK).json(
            response({
              message: "show all subscribe succefully",
              status: "OK",
              statusCode: httpStatus.OK,
              data: result,
             
            })
          );
})
// show subcribe
//-------------------------------------------
const updateSubcrib=catchAsync(async(req,res)=>{
    const {id}=req.query
    

    const result=await subscribService.updateSubcrib(id,req.body)
        // Return the success response
        res.status(httpStatus.OK).json(
            response({
              message: "updated subscribe succefully",
              status: "OK",
              statusCode: httpStatus.OK,
              data: result,
             
            })
          );
})

module.exports={
    createSubcrib,
    showSubscrib,
    updateSubcrib
}