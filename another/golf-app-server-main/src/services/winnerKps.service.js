const Tournament = require("../models/tournament.model")
const { Skin, Kps } = require("../models/winner.model")

// create all winner skin 
//----------------------------------------------------
const winnerKpscreate=async(data,userId)=>{

    const datas={
        ...data,
        winnerCreator:userId
    }

    const result =await Kps.create(datas)

    return result

}

// show all the user for the skin
//----------------------------------------------------------

const showAllUserForKps = async (id) => {
    // First, fetch the tournament by ID
    const tournament = await Tournament.findById(id).populate('tournamentPlayersList', 'name');
    console.log(tournament);

    if (!tournament) {
        throw new Error('Tournament not found');
    }

    // Get the tournamentPlayersList from the tournament
    const tournamentPlayersList = tournament.tournamentPlayersList;

    // Fetch all skins for the given tournament
    const allSkin = await Kps.find({ tournament: id });

    // Extract the list of users who already have a skin entry
    const existingUsersInSkin = allSkin.map(skin => skin.kpsWinner.toString());

    // Filter out users who are already in the Skin collection
    const filteredPlayers = tournamentPlayersList.filter(player => {
        return !existingUsersInSkin.includes(player._id.toString());
    });

    return filteredPlayers;
};


module.exports={
    winnerKpscreate,
    showAllUserForKps
}

