

const httpStatus = require("http-status");
const { TeeSheet } = require("../models")
const SmallTournament = require("../models/smallTournament.model")
const Tournament = require("../models/tournament.model");
const ApiError = require("../utils/ApiError");



// create tree sheet service 
//--------------------------------------------------
const createTeeSheet=async(data,userId)=>{

     // Check if playerList has at least 2 players
     if (data.playerList.length < 2) {
        throw new ApiError(httpStatus.CONFLICT, "You need at least two players.");
    }



    if (data.type==="big"){
        const allData={
            ...data,
            teeSheetCreator:userId,
            tournametId:data.tournamentId
    
        }
    
        const result=await TeeSheet.create(allData)
    
        return result

    }
    if (data.type==="small"){
        const allData={
            ...data,
            teeSheetCreator:userId,
            smallTournametId:data.tournamentId
    
        }
    
        const result=await TeeSheet.create(allData)
    
        return result

    }

    


}

// create tree sheet service 
//--------------------------------------------------
// const showMyTournament = async (searchText, id) => {
//     if (!id) {
//         throw new Error("User ID is required");
//     }

//     // Build search query conditionally
//     const searchCondition = searchText ? { $regex: new RegExp(searchText, "i") } : {};

//     const bigTournament = await Tournament.find(
//         {
//             ...searchCondition.clubName && { clubName: searchCondition },
//             tournamentCreator: id
//         },
//         { _id: 1, clubName: 1,typeName:1} // Only fetch _id and tournamentName
//     );

//     const smallTournament = await SmallTournament.find(
//         {
//             ...searchCondition.tournamentName && { tournamentName: searchCondition },
//             tournamentCreator: id
//         },
//         { _id: 1, tournamentName: 1,typeName:1 } // Only fetch _id and tournamentName
//     );

//     return [...bigTournament, ...smallTournament];
// };
const showMyTournament = async (searchText, id) => {
    if (!id) {
        throw new Error("User ID is required");
    }

    // Build search query conditionally
    const searchCondition = searchText ? { $regex: new RegExp(searchText, "i") } : {};

    // Fetch all tournaments created by the user
    const bigTournaments = await Tournament.find(
        {
            ...searchCondition.clubName && { clubName: searchCondition },
            tournamentCreator: id
        },
        { _id: 1, clubName: 1, typeName: 1, tournamentPlayersList: 1 } // Fetch players
    );

    const smallTournaments = await SmallTournament.find(
        {
            ...searchCondition.tournamentName && { tournamentName: searchCondition },
            tournamentCreator: id
        },
        { _id: 1, tournamentName: 1, typeName: 1, tournamentPlayersList: 1 } // Fetch players
    );

    // Function to check if all players are assigned in the TeeSheet
    const filterAssignedTournaments = async (tournaments, typeName) => {
        const filteredTournaments = [];

        for (const tournament of tournaments) {
            const teeSheets = await TeeSheet.find({
                $or: [
                    { tournametId: typeName === "big" ? tournament._id : null },
                    { smallTournametId: typeName === "small" ? tournament._id : null }
                ]
            });

            // Collect assigned players from all relevant TeeSheets
            const assignedPlayers = new Set(
                teeSheets.flatMap(sheet => sheet.playerList.map(player => player.toString()))
            );

            // If not all tournament players are assigned, keep the tournament
            const allPlayersAssigned = tournament.tournamentPlayersList.every(player =>
                assignedPlayers.has(player.toString())
            );

            if (!allPlayersAssigned) {
                filteredTournaments.push({
                    _id: tournament._id,
                    clubName: tournament.clubName || tournament.tournamentName,
                    typeName: tournament.typeName
                });
            }
        }

        return filteredTournaments;
    };

    // Filter out tournaments where all players are assigned
    const filteredBigTournaments = await filterAssignedTournaments(bigTournaments, "big");
    const filteredSmallTournaments = await filterAssignedTournaments(smallTournaments, "small");

    return [...filteredBigTournaments, ...filteredSmallTournaments];
};



// show my toruemant people by id 
//-----------------------------------------------------------------------
const showTournamentById = async (id, typeName) => {
    if (!id || !typeName) {
        throw new Error("Tournament ID and typeName are required");
    }

    // Determine the correct tournament model
    const tournamentModel = typeName === "big" ? Tournament : typeName === "small" ? SmallTournament : null;

    if (!tournamentModel) {
        throw new Error("Invalid tournament type");
    }

    // Fetch the tournament details
    const result = await tournamentModel.findById(id).populate("tournamentPlayersList", "name");

    if (!result) return null;

    // Fetch the players already assigned in the TeeSheet for this tournament
    const existingTeeSheet = await TeeSheet.find({
        $or: [
            { tournametId: typeName === "big" ? id : null },
            { smallTournametId: typeName === "small" ? id : null }
        ]
    });

    // Collect all player IDs from the TeeSheet
    const assignedPlayers = new Set(existingTeeSheet.flatMap(sheet => sheet.playerList.map(player => player.toString())));

    // Filter out players already in the TeeSheet
    const filteredPlayers = result.tournamentPlayersList.filter(player => !assignedPlayers.has(player._id.toString()));

    return {
        tournamentId: result._id,
        type: typeName,
        tournamentPlayersList: filteredPlayers,
        
    };
};

// teesheet  show by the toruement id 
//--------------------------------------------------------------
const showAllTeesheetByTournamentId=async(id)=>{

    const result =await TeeSheet.find({tournametId:id}).populate("playerList","clubHandicap handicap name teebox")
 

    return result
}

module.exports={
    createTeeSheet,
    showMyTournament,
    showTournamentById,
    showAllTeesheetByTournamentId
}