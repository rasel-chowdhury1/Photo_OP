const { User } = require("../models")
const Tournament = require("../models/tournament.model")
const {  PlayerScore } = require("../models/winner.model")

// create all winner skin 
//----------------------------------------------------
const winnerplayerScoreCreate=async(data,userId)=>{

    const tournament=await Tournament.findById(data.tournament)

    const datas={
        ...data,
        winnerCreator:userId
    }

    const result =await PlayerScore.create(datas)

    if (result && data.score && tournament.courseRating && tournament.slopeRating) {
        const handicap = ((data.score - tournament.courseRating) * 113) / tournament.slopeRating;
        
        // Round the handicap to 2 decimal places
        const roundedHandicap = Math.round(handicap * 100) / 100;
        
        console.log(roundedHandicap, "handicap",handicap,tournament.courseRating,tournament.slopeRating);
        
        await PlayerScore.findByIdAndUpdate(result._id, { handicapIndex: roundedHandicap }, { new: true });
    } else {
        console.log("Missing data: result, data.score, tournament.courseRating, or tournament.slopeRating is missing.");
    }
    

    const player=await PlayerScore.find({name:data.name})
    
    
        // If player has 5 or more scores, calculate the average handicap
        if (player.length >= 5) {
            // Calculate the average handicap index for the player
            const totalHandicap = player.reduce((sum, score) => sum + score.handicapIndex, 0);
            const averageHandicap = totalHandicap / player.length;
            console.log(averageHandicap,totalHandicap);

            // Round the average handicap to 2 decimal places
            const roundedAverageHandicap = Math.round(averageHandicap * 100) / 100;

            console.log("Average Handicap Index for the player: ", roundedAverageHandicap);

            // Optionally, update player's overall average handicap if needed
            await User.findByIdAndUpdate(data.name, { clubHandicap: roundedAverageHandicap }, { new: true });
        }

    return result

}

// show all the user for the skin
//----------------------------------------------------------

const showAllUserForplayerscore = async (id) => {
    // First, fetch the tournament by ID
    const tournament = await Tournament.findById(id).populate('tournamentPlayersList', 'name');
    console.log(tournament);

    if (!tournament) {
        throw new Error('Tournament not found');
    }

    // Get the tournamentPlayersList from the tournament
    const tournamentPlayersList = tournament.tournamentPlayersList;

    // Fetch all skins for the given tournament
    const allSkin = await PlayerScore.find({ tournament: id });

    // Extract the list of users who already have a skin entry
    const existingUsersInSkin = allSkin.map(skin => skin.name.toString());

    // Filter out users who are already in the Skin collection
    const filteredPlayers = tournamentPlayersList.filter(player => {
        return !existingUsersInSkin.includes(player._id.toString());
    });

    return filteredPlayers;
};


module.exports={
    winnerplayerScoreCreate,
    showAllUserForplayerscore
}

