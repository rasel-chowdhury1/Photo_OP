const httpStatus = require("http-status");
const Subscription = require("../models/subscription.model");
const ApiError = require("../utils/ApiError");

const { sendNotification } = require("../config/notifaction");
const User = require("../models/user.model");




const createSubscription=async(userId,data)=>{

    console.log(data,userId);
    const {  subscriptionType, stripeSubscriptionId, stripeCustomerId,planType, planPrice, paymentMethod } = data;

    const exitetingsubcription=await Subscription.findOne({subscribUser:userId,status:"active"})

    if(exitetingsubcription){
        throw new ApiError(409,"you have already have active subscription")
    }

    const subscription = new Subscription({
        subscribUser:userId,
        subscriptionType,
        stripeSubscriptionId,
        stripeCustomerId,
        planPrice,
        paymentMethod,
        planType
    });

    await subscription.save();

    await User.findByIdAndUpdate(userId,{isSubscribe:true})
    return subscription;


}


// show all subscriobe user 
//-------------------------------------------
const showAllSubscribeRequestedUser=async()=>{

    const subscribeUser=await Subscription.find({isApproved:false})

    return subscribeUser
}
// show all subscriobe user 
//-------------------------------------------
const showAllSubscribeUser=async()=>{

    const subscribeUser=await Subscription.find({status:"active",subscriptionType:"superUser",isApproved:true})

    return subscribeUser
}

// show all subscriobe user of block
//-------------------------------------------
const showAllSubscribeUserBlock=async()=>{

    const subscribeUser=await Subscription.find({status:"canceled",isApproved:false})

    return subscribeUser
}


// show all subscriobe user of block
//-------------------------------------------
const canceledSubscriber=async(subscribUser,subscribeId,id)=>{

  

      if(!subscribUser){
        throw new ApiError(httpStatus.NOT_FOUND,"subscribUser not found")
    }

    const subscribeUser=await Subscription.findByIdAndUpdate(subscribeId,{status:"canceled"},{new:true})
    // const subscribeUser=await User.findByIdAndUpdate(subscribUser,{role:"u"},{new:true})
    
  

    await sendNotification({
        sender:id,
     
        receiver: subscribUser,
        
        title: "Subscription Canceled by Admin",
        body: `Your subscription has been Cancled by amdin pleace contact to the admin .`,
        type: "subscription",
        linkId: `/user/${subscribUser}`
      });



    return subscribeUser
}
// show all subscriobe user of block
//-------------------------------------------
const acceptSubscribUser=async(subscribUser,subscribeId,id)=>{

    if(!subscribUser){
        throw new ApiError(httpStatus.NOT_FOUND,"subscribUser not found")
    }

    await Subscription.findByIdAndUpdate(subscribeId,{isApproved:true})
    const subscribeUser=await User.findByIdAndUpdate(subscribUser,{role:"supperUser"},{new:true})
    
  

    await sendNotification({
        sender:id,
     
        receiver: subscribUser,
        
        title: "Subscription Approved",
        body: `Your subscription has been approved and your role is now updated to superUser.`,
        type: "subscription",
        linkId: `/user/${subscribUser}`
      });


    return subscribeUser
}



module.exports={

    createSubscription,
    showAllSubscribeUser,
    showAllSubscribeUserBlock,
    canceledSubscriber,
    acceptSubscribUser,
    showAllSubscribeRequestedUser
}