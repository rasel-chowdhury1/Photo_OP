const Tournament = require("../models/tournament.model")
const { Skin, Kps, ChallengeMatch } = require("../models/winner.model")

// create all winner skin 
//----------------------------------------------------
const winnerChalangeMatchcreate=async(data,userId)=>{

    const datas={
        ...data,
        winnerCreator:userId
    }
console.log(datas,data);
    const result =await ChallengeMatch.create(datas)

    return result

}

// show all the user for the skin
//----------------------------------------------------------

const showAllUserforChalangeMatch = async (id) => {
    // First, fetch the tournament by ID and populate the players
    const tournament = await Tournament.findById(id).populate('tournamentPlayersList', 'name');
    
    if (!tournament) {
        throw new Error('Tournament not found');
    }

    // Get the tournamentPlayersList from the tournament
    const tournamentPlayersList = tournament.tournamentPlayersList;

    // Fetch all ChallengeMatches for the given tournament
    const allChallengeMatches = await ChallengeMatch.find({ tournament: id })
    console.log(allChallengeMatches);

    // Extract the list of users who have already participated in the challenge match (both winner and loser)
    const existingUsersInChallengeMatch = [];
    allChallengeMatches.forEach(match => {
        if (match.challengeWinner) {
            existingUsersInChallengeMatch.push(match.challengeWinner.toString());
        }
        if (match.challengeLoser) {
            existingUsersInChallengeMatch.push(match.challengeLoser.toString());
        }
    });

    // Filter out users who are already in a ChallengeMatch
    const filteredPlayers = tournamentPlayersList.filter(player => {
        return !existingUsersInChallengeMatch.includes(player._id.toString());
    });

    console.log(existingUsersInChallengeMatch,allChallengeMatches);

   
    // Return only players who are NOT part of any ChallengeMatch
    return filteredPlayers;
};




module.exports={
    showAllUserforChalangeMatch,
    winnerChalangeMatchcreate
}

