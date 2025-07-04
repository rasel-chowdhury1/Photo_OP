const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { enteredService } = require("../services");
const response = require("../config/response");

// show all my toruement that i am going to play 
const showMyEntered=catchAsync(async(req,res)=>{

    const  userId=req.user._id
    const result=await enteredService.showMyEntered(userId)
  
    // Return the success response
    res.status(httpStatus.OK).json(
        response({
          message: "show all my entered successfully",
          status: "OK",
          statusCode: httpStatus.OK,
          data: result,
         
        })
      );
    
})

// show intered by showTournaemntById
//--------------------------------------------------

const showTournaemntById =catchAsync(async(req,res)=>{
    const {id,type}=req.query
    const result= await enteredService.showTournaemntById(id,type)
    console.log(id,type);
    // Return the success response
    res.status(httpStatus.OK).json(
        response({
          message: "show  entered details",
          status: "OK",
          statusCode: httpStatus.OK,
          data: result,
         
        })
      );
    

})

module.exports={
    showMyEntered,
    showTournaemntById
}