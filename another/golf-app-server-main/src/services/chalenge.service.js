
const httpStatus = require('http-status');
const ChalangeMatch = require('../models/chalangeMatch.model');
const ApiError = require('../utils/ApiError');
const Tournament = require('../models/tournament.model');
const SmallTournament = require('../models/smallTournament.model');

// Create a new challenge match
// const createChalangeMatch = async (data, userId) => {
//     if (!data.playeare1 || !data.playeare2) {
//         throw new ApiError(httpStatus.BAD_REQUEST, "Both players are required.");
//     }

//     if (String(data.playeare1) === String(data.playeare2)) {
//         throw new ApiError(httpStatus.BAD_REQUEST, "Player 1 and Player 2 cannot be the same.");
//     }

//     if(data.type==="big"){
//         const matchData = {
//             ...data,
//             tournamentCreator: userId,
//             bigTournament:data.tournamentid,
//         };
    
//         const result = await ChalangeMatch.create(matchData);
//         return result;

//     }
//     if(data.type==="small"){
//         const matchData = {
//             ...data,
//             tournamentCreator: userId,
//             smallTournament:data.tournamentid,
//         };
    
//         const result = await ChalangeMatch.create(matchData);
//         return result;

//     }
   
// };

const createChalangeMatch = async (data, userId) => {
    if (!data.playeare1 || !data.playeare2) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Both players are required.");
    }

    if (String(data.playeare1) === String(data.playeare2)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Player 1 and Player 2 cannot be the same.");
    }

    // Check if a challenge match already exists with these players in the same tournament
    const existingMatch = await ChalangeMatch.findOne({
        $or: [
            { playeare1: data.playeare1, playeare2: data.playeare2, bigTournament: data.tournamentid },
            { playeare1: data.playeare2, playeare2: data.playeare1, bigTournament: data.tournamentid },
            { playeare1: data.playeare1, playeare2: data.playeare2, smallTournament: data.tournamentid },
            { playeare1: data.playeare2, playeare2: data.playeare1, smallTournament: data.tournamentid }
        ]
    });

    if (existingMatch) {
        throw new ApiError(httpStatus.CONFLICT, "This challenge match already exists.");
    }

    let matchData = {
        ...data,
        tournamentCreator: userId,
    };

    if (data.type === "big") {
        matchData.bigTournament = data.tournamentid;
    } else if (data.type === "small") {
        matchData.smallTournament = data.tournamentid;
    }

    const result = await ChalangeMatch.create(matchData);
    return result;
};


// Get all challenge matches for a user
const showAllMyChalangeMatches = async (userId,id,type) => {



   if(type==="big"){
    const result = await ChalangeMatch.find({

       bigTournament:id
    })
    .populate({
        path: "tournamentCreator",
        select: "name email"
    })
    .populate({
        path: "bigTournament",
        select: "tournamentName courseName"
    })
   
    .populate({
        path: "playeare1",
        select: "name image clubHandicap handicap"
    })
    .populate({
        path: "playeare2",
        select: "name image clubHandicap handicap"
    });

    return result;
   }

   if(type==="small"){
   
    const result = await ChalangeMatch.find({
       
        smallTournament:id
    })
    .populate({
        path: "tournamentCreator",
        select: "name email"
    })
   
    .populate({
        path: "smallTournament",
        select: "tournamentName courseName"
    })
    .populate({
        path: "playeare1",
        select: "name image clubHandicap handicap"
    })
    .populate({
        path: "playeare2",
        select: "name image clubHandicap handicap"
    });

    return result;
   }
};

// Get a single challenge match by ID
const getChalangeMatchById = async (id) => {
    const result = await ChalangeMatch.findById(id)
        .populate({
            path: "tournamentCreator",
            select: "name email"
        })
        .populate({
            path: "bigTournament",
            select: "tournamentName courseName"
        })
        .populate({
            path: "smallTournament",
            select: "tournamentName courseName"
        })
        .populate({
            path: "playeare1",
            select: "name image clubHandicap handicap"
        })
        .populate({
            path: "playeare2",
            select: "name image clubHandicap handicap"
        });

    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, "Challenge match not found.");
    }

    return result;
};

// Update a challenge match
const updateChalangeMatch = async (id, updateData) => {
    const result = await ChalangeMatch.findByIdAndUpdate(id, updateData, { new: true });

    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, "Challenge match not found.");
    }

    return result;
};

// Delete a challenge match
const deleteChalangeMatch = async (id) => {
    const result = await ChalangeMatch.findByIdAndDelete(id);

    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, "Challenge match not found.");
    }
};

// show all the player of the tourmaent
//-------------------------------------------------------------------------------
// const showAllThePlayer=async(userId,data)=>{

//     if(data.type==="big"){

//         const result = await Tournament.findById(data.id)
//         .populate({
//             path: "tournamentPlayersList",
//             select: "name" // Only fetch the name field
//         });

// const mydata={
//     tournamentId:result._id,
//     type:result.typeName,

//     tournamentPlayersList:result.tournamentPlayersList
// }

//         return mydata
//     }
//     if(data.type==="small"){

//         const result = await SmallTournament.findById(data.id)
//         .populate({
//             path: "tournamentPlayersList",
//             select: "name" // Only fetch the name field
//         });

//         const mydata={
//             tournament:result._id,
//             type:result.typeName,
//             tournamentPlayersList:result.tournamentPlayersList
//         }

//         return mydata
//     }
   
// }

const showAllThePlayer = async (userId, data) => {

    let result;
    
    if (data.type === "big") {
        result = await Tournament.findById(data.id)
            .populate("clubName")
            .populate({
                path: "tournamentPlayersList",
                select: "name" // Only fetch the name field
            });
    } else if (data.type === "small") {
        result = await SmallTournament.findById(data.id)
            .populate("tournamentName")
            .populate({
                path: "tournamentPlayersList",
                select: "name" // Only fetch the name field
            });
    }

    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, "Tournament not found.");
    }

    // Find players who are already assigned in a challenge match
    const assignedPlayers = await ChalangeMatch.find({
        $or: [{ bigTournament: data.id }, { smallTournament: data.id }]
    }).select("playeare1 playeare2");

    // Extract assigned player IDs
    const assignedPlayerIds = new Set(assignedPlayers.flatMap(match => [String(match.playeare1), String(match.playeare2)]));

    // Filter out players who are already assigned in a challenge match
    const filteredPlayers = result.tournamentPlayersList.filter(player => !assignedPlayerIds.has(String(player._id)));

    const mydata = {
        tournamentId: result._id,
        type: result.typeName,
        tournamentPlayersList: filteredPlayers
    };

    return mydata;
};
// const showAllThePlayer = async (userId) => {
//     console.log("User ID:", userId);

//     // Find big tournaments where userId is the creator
//     const bigTournaments = await Tournament.find({ tournamentCreator: userId })
//         // .populate("clubName")
//         // .populate({
//         //     path: "tournamentPlayersList",
//         //     select: "name"
//         // });

//     // Find small tournaments where userId is the creator
//     const smallTournaments = await SmallTournament.find({ tournamentCreator: userId })
//         // .populate("tournamentName")
//         // .populate({
//         //     path: "tournamentPlayersList",
//         //     select: "name"
//         // });

//     // If no tournaments found, return a message
//     // if (bigTournaments.length === 0 && smallTournaments.length === 0) {
//     //     throw new ApiError(httpStatus.NOT_FOUND, "You don’t have any tournaments (big or small).");
//     // }

//     console.log(bigTournaments,smallTournaments,"sdfljsdlfjlkj");
//     // Combine results (can be only big, only small, or both)
//     const allTournaments = [...bigTournaments, ...smallTournaments];

//     // // Get tournament IDs for filtering challenge matches
//     // const tournamentIds = allTournaments.map(tournament => tournament._id);

//     // // Find players already assigned in challenge matches
//     // const assignedPlayers = await ChalangeMatch.find({
//     //     $or: [
//     //         { bigTournament: { $in: tournamentIds } }, 
//     //         { smallTournament: { $in: tournamentIds } }
//     //     ]
//     // }).select("playeare1 playeare2");

//     // // Extract assigned player IDs
//     // const assignedPlayerIds = new Set(
//     //     assignedPlayers.flatMap(match => [String(match.playeare1), String(match.playeare2)])
//     // );

//     // // Filter players who are not in challenge matches
//     // allTournaments.forEach(tournament => {
//     //     tournament.tournamentPlayersList = tournament.tournamentPlayersList.filter(
//     //         player => !assignedPlayerIds.has(String(player._id))
//     //     );
//     // });

//     return allTournaments;
// };


// chalange delete 
//--------------------------------------

module.exports = {
    createChalangeMatch,
    showAllMyChalangeMatches,
    getChalangeMatchById,
    updateChalangeMatch,
    deleteChalangeMatch,
    showAllThePlayer
};
