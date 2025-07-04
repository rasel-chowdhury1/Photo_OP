
const Tournament = require("../models/tournament.model");
const { Skin, Kps, PlayerScore, ChallengeMatch } = require("../models/winner.model")

const showAllWinnerResultForTournament=async(userId,id)=>{
    console.log(userId,id);

    const skin=await Skin.find({tournament:id}).populate("skinWinner","name")
    const kps=await Kps.find({tournament:id}).populate("kpsWinner","name")
    const playerScore=await PlayerScore.find({tournament:id}).populate("name","name teebox")
    const chalangeMatch=await ChallengeMatch.find({tournament:id}).populate("challengeWinner challengeLoser","name name")

    console.log(skin);

const data ={
    skin,
    kps,
    playerScore,
    chalangeMatch
}



    return data


}

// updte the touranemtn to show in the user section 
//---------------------------------------------------------------------
const updateTournamentForShowPalyer=async(id)=>{

    const result =await Tournament.findByIdAndUpdate(id,{iswinner:true},{new:true})
    return result
}

module.exports={
    showAllWinnerResultForTournament,
    updateTournamentForShowPalyer
}