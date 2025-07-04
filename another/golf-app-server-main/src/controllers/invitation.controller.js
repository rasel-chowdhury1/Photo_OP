const httpStatus = require("http-status");
const { invitationService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");


// caret invation controller 
//----------------------------------------------------------------------------

const makeRequestToPlay=catchAsync(async(req,res)=>{

    const inviteSenderId=req.user._id
   

    const result=await invitationService.makeRequestToPlay(inviteSenderId,req.body)

// Return the success response
res.status(httpStatus.OK).json(
    response({
      message: " invation created successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
     
    })
  );

})

// show all my invation controller 
//------------------------------------------------------------
const showAllMyInvation=catchAsync(async(req,res)=>{
  const userId=req.user._id

  console.log(userId);
  const result=await invitationService.showAllMyInvation(userId)

  // Return the success response
  res.status(httpStatus.OK).json(
      response({
        message: "show all invation successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
       
      })
    );
  


})


// invation invationAccepted 
//----------------------------------------------------
const invationAccepted=catchAsync(async(req,res)=>{
  const  {id}=req.query
  const result=await invitationService.invationAccepted(id)

  // Return the success response
  res.status(httpStatus.OK).json(
      response({
        message: "invite accepted  successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
       
      })
    );
  

  
})

// invation invationAccepted 
//----------------------------------------------------
const invationDelete=catchAsync(async(req,res)=>{
  const id=req.query.id
  const result=await invitationService.invationDelete(id)

  // Return the success response
  res.status(httpStatus.OK).json(
      response({
        message: "invite Delete  successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
       
      })
    );
  

  
})
module.exports={
    makeRequestToPlay,
    showAllMyInvation,
    invationAccepted,
    invationDelete
}