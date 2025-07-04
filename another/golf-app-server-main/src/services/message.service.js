


const Message = require("../models/message.model")



// show all my message
//------------------------------------------

const showMyChatMessage=async(chatid)=>{


    const result =await Message.find({chatRoomId:chatid})
    console.log(result , chatid);

    return result

}

module.exports={
    showMyChatMessage
}