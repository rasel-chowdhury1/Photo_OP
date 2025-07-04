

const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { chatService } = require("../services");

// create a singale chat
//----------------------------------------------------------
const createsingleChat=catchAsync(async(req,res)=>{

    const creator=req.user._id


    const result=await chatService.createsingleChat(creator,req.body)
    

    if(result.status===200){
      // Return the success response
    res.status(httpStatus.OK).json(
      response({
        message: " single chat  ",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result.existingChat,
      })
    );
    }
    if(result.status===201){
   // Return the success response
   res.status(httpStatus.CREATED).json(
    response({
      message: "create the single chat ",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: result.result,
    })
  );
    }

    

})
// create a singale chat
//----------------------------------------------------------
const createGroupChat=catchAsync(async(req,res)=>{

    const userId=req.user._id


    const result=await chatService.createGroupChat(userId,req.body)


    if(result.status===200){
 // Return the success response
 res.status(httpStatus.OK).json(
  response({
    message: "show group chat ",
    status: "OK",
    statusCode: httpStatus.OK,
    data: result.chatRoom,
  })
);
    }
    if(result.status===201){
 // Return the success response
 res.status(httpStatus.CREATED).json(
  response({
    message: "create the group chat ",
    status: "OK",
    statusCode: httpStatus.CREATED,
    data: result.chatRoom,
  })
);
    }
   

})
// create a singale chat
//----------------------------------------------------------
const showMyCaht=catchAsync(async(req,res)=>{

    const userId=req.user._id


    const result=await chatService.showMyCaht(userId)

    // Return the success response
    res.status(httpStatus.OK).json(
        response({
          message: "show  the  chat ",
          status: "OK",
          statusCode: httpStatus.OK,
          data: result,
        })
      );

})

module.exports={
    createsingleChat,
    createGroupChat,
    showMyCaht
}