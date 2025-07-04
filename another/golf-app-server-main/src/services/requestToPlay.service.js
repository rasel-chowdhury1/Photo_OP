const httpStatus = require("http-status");
const RequestToPlay = require("../models/requestPlay.model");
const SmallTournament = require("../models/smallTournament.model");
const Tournament = require("../models/tournament.model");
const ApiError = require("../utils/ApiError");
const { sendNotification } = require("../config/notifaction");



const makeRequestToplay=async(userId,tournamentId,typename)=>{

  

    if(typename==="big"){
        // Find the tournament by ID
     const tournament = await Tournament.findById(tournamentId).populate("tournamentCreator");
       if (!tournament) {
           throw new ApiError(httpStatus.NOT_FOUND, "Tournament not found");
         }
       
         if (tournament.tournamentPlayersList.length >= tournament.numberOfPlayers) {
           throw new ApiError(httpStatus.CONFLICT, "Tournament is already full");
         }
       
         if (tournament.tournamentPlayersList.includes(userId)) {
           throw new ApiError(httpStatus.CONFLICT, "You are already registered in this tournament");
         }
        // Create an invitation request
     const requested = new RequestToPlay({
        requestedUser: userId,
        tournamentcreator: tournament.tournamentCreator._id,
        tournament: tournamentId,
        tournamentType:"big",
        isAccepted: false, // The tournament creator will need to accept
     });

     console.log(requested,"sdlkfjlsdkjflksdjflksdjklfjsd");
   
     await requested.save();
     // Add user to tournamentPlayersList
     tournament.tournamentPlayersList.push(userId);
     await tournament.save();
   
     // Send notification to the tournament creator
     await sendNotification({
       sender: userId,
       receiver: tournament.tournamentCreator._id,
       tournamentId,
       title: "Tournament Join Request",
       body: `A new player has requested to join your tournament: ${tournament.name}. Accept or decline the request.`,
       type: "tournament",
       linkId: `/tournament/${tournamentId}/requested`
     });
   
     return requested
       
     }
   
   
   if(typename==="small"){
        // Find the tournament by ID
     const tournament = await SmallTournament.findById(tournamentId).populate("tournamentCreator");
       
     if (!tournament) {
       throw new ApiError(httpStatus.NOT_FOUND, "Tournament not found");
     }
   
     if (tournament.tournamentPlayersList.length >= tournament.numberOfPlayers) {
       throw new ApiError(httpStatus.CONFLICT, "Tournament is already full");
     }
   
     if (tournament.tournamentPlayersList.includes(userId)) {
       throw new ApiError(httpStatus.CONFLICT, "You are already registered in this tournament");
     }
   
     // Create an invitation request
     const requested = new RequestToPlay({
       requestedUser: userId,
       tournamentcreator: tournament.tournamentCreator._id,
       tournament: tournamentId,
       tournamentType:"small",
       isAccepted: false, // The tournament creator will need to accept
     });
     console.log(requested,"sdlkfjlsdkjflksdjflksdjklfjsd");

   
     await requested.save();
     // Add user to tournamentPlayersList
     tournament.tournamentPlayersList.push(userId);
     await tournament.save();
   
     // Send notification to the tournament creator
     await sendNotification({
       sender: userId,
       receiver: tournament.tournamentCreator._id,
       tournamentId,
       title: "Tournament Join Request",
       body: `A new player has requested to join your tournament: ${tournament.name}. Accept or decline the invitation.`,
       type: "tournament",
       linkId: `/tournament/${tournamentId}/requested`
     });
   
     return requested
   
   }
   throw new ApiError(httpStatus.CONFLICT, "You are already registered in this tournament");
   
   };



   const showAllrequestedtournament=async(id,typename,page,limit)=>{

    console.log(id,typename);

    if(typename==="small"){
        const requeist=await RequestToPlay.find({tournamentType:typename,tournamentcreator:id,isCancale:false})
        .populate("requestedUser", "name") // Populating only the 'name' field of the requestedUser
        .populate("tournament"," courseName time date tournamentType   ")// Populating only the 'name' field of the tournament
      


        .skip((page - 1) * limit)
        .limit(limit);
        

        // if(requeist.length==0){
        //     throw new ApiError(httpStatus.OK,"small tournament not found",[])
        // }

        const requestCount=await RequestToPlay.find({tournamentType:typename,tournamentcreator:id}).countDocuments()

        return {requeist,requestCount}
    }
    if(typename==="big"){
        const requeist=await RequestToPlay.find({tournamentType:typename,tournamentcreator:id,isCancale:false})
        .populate("requestedUser", "name") // Populating only the 'name' field of the requestedUser
  .populate("tournament"," courseName time date tournamentType clubName  ")// Populating only the 'name' field of the tournament


        .skip((page - 1) * limit)
        .limit(limit);

        // if(requeist.length==0){
        //     throw new ApiError(httpStatus.OK,"big  tournament not found",[])
        // }


        const requestCount=await RequestToPlay.find({tournamentType:typename,tournamentcreator:id,isCancale:false}).countDocuments()

        return {requeist,requestCount}
    }
   
    

   }

const showrequestDetalsById=async(id)=>{
    const result=await RequestToPlay.findById(id)
    return result
}

// aproved requiest

const aprovedTheReques=async(id)=>{

    const result=await RequestToPlay.findByIdAndUpdate(id,{isAccepted:true},{new:true})

    if(!result){
        throw new ApiError(httpStatus.NOT_FOUND,"request not found")
    }

    await sendNotification({
        sender: result.tournamentcreator,
        receiver: result.requestedUser,
        tournamentId:result.tournament,
        title: `you are approved for the ${result.tournamentType} tournament `,
        body: `your requested is aproved by the tournament creator`,
        type: "tournament",
        linkId: `/request-to-play/${id}`
      });

    return result

}

// cancel request
//-------------------------------------
const cancelRequest =async(id) => {


    const result=await RequestToPlay.findByIdAndUpdate(id,{isCancale:true},{new:true})

    

    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, "Request not found");
    }

    // Remove user from the tournament player list correctly
    if (result.tournamentType === "big") {
        await Tournament.findByIdAndUpdate(
            result.tournament,
            { $pull: { tournamentPlayersList: result.requestedUser } }, // Correct approach
            { new: true }
        );
    }

    if (result.tournamentType === "small") {
        await SmallTournament.findByIdAndUpdate(
            result.tournament,
            { $pull: { tournamentPlayersList: result.requestedUser } }, // Correct approach
            { new: true }
        );
    }

    await sendNotification({
        sender: result.tournamentcreator,
        receiver: result.requestedUser,
        tournamentId: result.tournament,
        title: `You are removed from the ${result.tournamentType} tournament`,
        body: `Your request has been canceled by the tournament creator.`,
        type: "tournament",
        linkId: `/request-to-play/${id}`
    });

    return result;
};


module.exports={

    makeRequestToplay,
    showAllrequestedtournament,
    showrequestDetalsById,
    aprovedTheReques,
    cancelRequest
}