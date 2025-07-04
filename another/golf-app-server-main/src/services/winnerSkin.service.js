

const Tournament = require("../models/tournament.model")
const { Skin } = require("../models/winner.model")

// create all winner skin 
//----------------------------------------------------
const winnerSkincreate=async(data,userId)=>{
   

    const datas={
        ...data,
        winnerCreator:userId
    }

    const result =await Skin.create(datas)
  

    return result

}

// show all the user for the skin
//----------------------------------------------------------

const showAllUserForSkin = async (id) => {
    // First, fetch the tournament by ID
    const tournament = await Tournament.findById(id).populate('tournamentPlayersList', 'name');

    if (!tournament) {
        throw new Error('Tournament not found');
    }

    // Get the tournamentPlayersList from the tournament
    const tournamentPlayersList = tournament.tournamentPlayersList;

    // Fetch all skins for the given tournament
    const allSkin = await Skin.find({ tournament: id });

    // Extract the list of users who already have a skin entry
    const existingUsersInSkin = allSkin.map(skin => skin.skinWinner.toString());

    // Filter out users who are already in the Skin collection
    const filteredPlayers = tournamentPlayersList.filter(player => {
        return !existingUsersInSkin.includes(player._id.toString());
    });

    return filteredPlayers;
};


// update the skin of winners
//------------------------------------------------------------------------
const updateWinnerSkin = async (data, userId) => {
   
        // Find the Skin by ID and update it with the new data
        const updatedSkin = await Skin.findByIdAndUpdate(data.skinId, {
            ...data,
            // winnerCreator: userId // Ensure winnerCreator is updated as well
        }, { new: true }); // `new: true` ensures the returned document is the updated one

        // If no skin found, return an error
        if (!updatedSkin) {
            throw new Error('Skin not found');
        }

        return updatedSkin;
    }


module.exports={
    winnerSkincreate,
    showAllUserForSkin,
    updateWinnerSkin
}