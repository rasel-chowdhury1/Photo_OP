const Subscribe = require("../models/subscrib.model")



// subscribe the 
//----------------------------------
const createSubcrib=async(userId,data)=>{

    const result =await Subscribe.create(data)

    return result
}


// show all subscribe 
//-----------------------------------------------
const showSubscrib=async()=>{
    const result=await Subscribe.find()
    return result
}
// upadate  subscrib
//----------------------------------------------
const updateSubcrib = async (id, data) => {
  const updatedSubscription = await Subscribe.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  );

  if (!updatedSubscription) {
    throw new Error('Subscription not found');
  }

  return updatedSubscription;
};

module.exports={
    createSubcrib,
    showSubscrib,
    updateSubcrib
}