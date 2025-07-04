const { LookingToPlay } = require("../models")
const SmallTournament = require("../models/smallTournament.model")
const Tournament = require("../models/tournament.model")





// create the looking to play
//------------------------------------------------------------------------------

const lookingToPlayCreate=async(userId,data)=>{

    const datas={
        ...data,
        player:userId
    }

    const result=await LookingToPlay.create(datas)


    return result
}


// create the looking to play
//------------------------------------------------------------------------------

const showAllLookingToPlay=async()=>{

    const result=await LookingToPlay.find({isAccepted:false})
    .sort({ createdAt: -1 }); // Ensure `createdAt` exists in your schema

    return result
}


// show all my tournament 
//-----------------------------------------------------
const showAllTournament=async(userId)=>{

    // const smallTournament=await SmallTournament.find({tournamentCreator:userId,isClose:true})
    // const bigTournament=await Tournament.find({tournamentCreator:userId,isClose:true})
    const smallTournament=await SmallTournament.find({tournamentCreator:userId})
    const bigTournament=await Tournament.find({tournamentCreator:userId})

    const data={
        smallTournament,
        bigTournament
    }

    return data
}

module.exports={
    lookingToPlayCreate,
    showAllLookingToPlay,
    showAllTournament
}