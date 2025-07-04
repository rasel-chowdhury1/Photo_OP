const { Notification } = require("../models")



const getAllNotifaction=async(userId,page,limit)=>{

    const allNotifaction=await Notification.find({receiver:userId})
    .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

    const totalNotifactio=await Notification.find({receiver:userId}).countDocuments()



    return {allNotifaction,totalNotifactio}

}

// make notifaciont mark as read
//------------------------------------------------------------------

const markAsRead=async(id)=>{
    const readNotification=await Notification.findByIdAndUpdate(id,{isRead:true},{new:true})
    return readNotification
}

module.exports={
    getAllNotifaction,
    markAsRead
}