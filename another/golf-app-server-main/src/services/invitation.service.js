const httpStatus = require("http-status");
const Invitation = require("../models/invitation.model");
const Tournament = require("../models/tournament.model");
const ApiError = require("../utils/ApiError");
const { sendNotification } = require("../config/notifaction");
const SmallTournament = require("../models/smallTournament.model");


// const makeRequestToPlay = async (tournamentId, userId, typename) => {
 
//     console.log(typename);
 



 

//   if(typename==="big"){
//      // Find the tournament by ID
//   const tournament = await Tournament.findById(tournamentId).populate("tournamentCreator");
//     if (!tournament) {
//         throw new ApiError(httpStatus.NOT_FOUND, "Tournament not found");
//       }
    
//       if (tournament.tournamentPlayersList.length >= tournament.numberOfPlayers) {
//         throw new ApiError(httpStatus.CONFLICT, "Tournament is already full");
//       }
    
//       if (tournament.tournamentPlayersList.includes(userId)) {
//         throw new ApiError(httpStatus.CONFLICT, "You are already registered in this tournament");
//       }
//      // Create an invitation request
//   const invitation = new Invitation({
//     requestedUser: userId,
//     tournamentcreator: tournament.tournamentCreator._id,
//     tournament: tournamentId,
//     tournamentType:"big",
//     isAccepted: false, // The tournament creator will need to accept
//   });

//   await invitation.save();
//   // Add user to tournamentPlayersList
//   tournament.tournamentPlayersList.push(userId);
//   await tournament.save();

//   // Send notification to the tournament creator
//   await sendNotification({
//     sender: userId,
//     receiver: tournament.tournamentCreator._id,
//     tournamentId,
//     title: "Tournament Join Request",
//     body: `A new player has requested to join your tournament: ${tournament.name}. Accept or decline the invitation.`,
//     type: "tournament",
//     linkId: `/tournament/${tournamentId}/invitations`
//   });

//   return invitation
    
//   }


// if(typename==="small"){
//      // Find the tournament by ID
//   const tournament = await SmallTournament.findById(tournamentId).populate("tournamentCreator");
    
//   if (!tournament) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Tournament not found");
//   }

//   if (tournament.tournamentPlayersList.length >= tournament.numberOfPlayers) {
//     throw new ApiError(httpStatus.CONFLICT, "Tournament is already full");
//   }

//   if (tournament.tournamentPlayersList.includes(userId)) {
//     throw new ApiError(httpStatus.CONFLICT, "You are already registered in this tournament");
//   }

//   // Create an invitation request
//   const invitation = new Invitation({
//     requestedUser: userId,
//     tournamentcreator: tournament.tournamentCreator._id,
//     tournament: tournamentId,
//     tournamentType:"small",
//     isAccepted: false, // The tournament creator will need to accept
//   });

//   await invitation.save();
//   // Add user to tournamentPlayersList
//   tournament.tournamentPlayersList.push(userId);
//   await tournament.save();

//   // Send notification to the tournament creator
//   await sendNotification({
//     sender: userId,
//     receiver: tournament.tournamentCreator._id,
//     tournamentId,
//     title: "Tournament Join Request",
//     body: `A new player has requested to join your tournament: ${tournament.name}. Accept or decline the invitation.`,
//     type: "tournament",
//     linkId: `/tournament/${tournamentId}/invitations`
//   });

//   return invitation

// }
// throw new ApiError(httpStatus.CONFLICT, "You are already registered in this tournament");

// };


// make invation request
//----------------------------------------------------------------------------
const makeRequestToPlay = async (inviteSenderId, data) => {
let inviteData={}
  if (data.tournamentType==="big"){
     // Prepare the invitation data
   inviteData = {
    ...data,
    bigTournament:data.tournamentId,
    inviteSender: inviteSenderId, // The user sending the invite
  };

  }
  if (data.tournamentType==="small"){
     // Prepare the invitation data
   inviteData = {
    ...data,
    smallTournament:data.tournamentId,
    inviteSender: inviteSenderId, // The user sending the invite
  };

  }
 

  // Create the invitation
  const result = await Invitation.create(inviteData);

  return result;
};

// request accpeted by the player services
//------------------------------------------------------------
const showAllMyInvation=async(id)=>{


  const result=await Invitation.find({player:id,isRejected:false})
  .populate({
    path: "inviteSender",
    select: "image name" // Correct way to select specific fields
  })
  .populate({
    path:"smallTournament",
    select:"tournamentName courseName"
  })
  .populate({
    path:"bigTournament",
    select:"courseName clubName tournamentName"
  })
console.log(result,"-------------------");
  return result

  

}
// request accpeted by the player services
//------------------------------------------------------------
const invationAccepted=async(id)=>{

  const result=await Invitation.findByIdAndUpdate(id,{isAccepted:true},{new:true})
 
  if(!result){
    throw new ApiError(httpStatus.NOT_FOUND,"invation not found")
  }


  if(result.tournamentType==="big"){
    let tournament= await Tournament.findById(result.bigTournament)

    tournament.tournamentPlayersList.push(result.player)
await tournament.save()
    console.log(tournament,"big");
  }
  if(result.tournamentType==="small"){
    let tournament= await SmallTournament.findById(result.smallTournament)

    tournament.tournamentPlayersList.push(result.player)
    await tournament.save()
    console.log(tournament,"small");

  }

  
  return result


}
// request accpeted by the player services
//------------------------------------------------------------
const invationDelete=async(id)=>{

  const result=await Invitation.findByIdAndDelete(id)
  
  
  return result


}



module.exports = {
  makeRequestToPlay,
  showAllMyInvation,
  invationAccepted,
  invationDelete
};
