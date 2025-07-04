const SmallTournament = require("../models/smallTournament.model");
const Tournament = require("../models/tournament.model")



// const showMyEntered = async (userId) => {
   

//     // Find tournaments where the user is a participant but not the creator
//     const myEnteredAsPlayer = await Tournament.find({
//         tournamentPlayersList: userId
//     }).lean().populate("tournamentCreator","name" ) // Convert to plain objects for modification
//     // Find tournaments where the user is a participant but not the creator
//     const myEnteredAsPlayerSmall = await SmallTournament.find({
//         tournamentPlayersList: userId
//     }).lean()
//     .populate("tournamentCreator","name " )
//     // Convert to plain objects for modification

//     console.log(myEnteredAsPlayer.length,myEnteredAsPlayerSmall.length);
//     // Add extra text for tournaments where the user is just a player
//     const formattedTournaments = myEnteredAsPlayer.map(tournament => {
//         // If the user is not the creator but is a participant, add extra text
//         if (tournament.tournamentCreator.toString() !== userId.toString()) {
//             return { 
//                 ...tournament, 
//                 // ismyTournament: "false" 
//             };
//         }
//         return tournament;
//     });
//     // Add extra text for tournaments where the user is just a player
//     const formattedTournamentsSmall = myEnteredAsPlayerSmall.map(tournament => {
//         // If the user is not the creator but is a participant, add extra text
//         if (tournament.tournamentCreator.toString() !== userId.toString()) {
//             return { 
//                 ...tournament, 
//                 // ismyTournament: "false" 
//             };
//         }
//         return tournament;
//     });

//     // Merge both arrays into one
//     const allEnteredTournaments = [...formattedTournaments,...formattedTournamentsSmall];

//     return allEnteredTournaments;
// };

// show trouenament details
//--------------------------------------------------------


const showMyEntered = async (userId) => {
    // Find tournaments where the user is a participant (player)
    const myEnteredAsPlayer = await Tournament.find({
        tournamentPlayersList: userId
    }).lean().populate("tournamentCreator", "name");

    // Find small tournaments where the user is a participant (player)
    const myEnteredAsPlayerSmall = await SmallTournament.find({
        tournamentPlayersList: userId
    }).lean().populate("tournamentCreator", "name");

    // Find tournaments where the user is the creator
    const myCreatedTournaments = await Tournament.find({
        tournamentCreator: userId
    }).lean().populate("tournamentCreator", "name");

    // Find small tournaments where the user is the creator
    const myCreatedSmallTournaments = await SmallTournament.find({
        tournamentCreator: userId
    }).lean().populate("tournamentCreator", "name");

    // Combine all tournaments where the user is a creator or a participant
    const allTournaments = [
        ...myEnteredAsPlayer,
        ...myEnteredAsPlayerSmall,
        ...myCreatedTournaments,
        ...myCreatedSmallTournaments
    ];

    // To ensure that there are no duplicates, use a Map with tournament ID as the key
    const uniqueTournamentsMap = new Map();
    
    allTournaments.forEach(tournament => {
        // Use tournament ID as the key to avoid duplicates
        uniqueTournamentsMap.set(tournament._id.toString(), tournament);
    });

    // Convert the map back to an array
    const uniqueTournaments = Array.from(uniqueTournamentsMap.values());

    return uniqueTournaments;
};


const showTournaemntById=async(id,type)=>{

    if (type==="big"){
        // const result=await Tournament.findById(id)
      
        const result = await Tournament.findById(id)
    .populate("tournamentCreator", "name")
    .populate("tournamentPlayersList", "name clubHandicap handicap")
    .lean(); // Populate only the name of players

        return result
    }

    if (type==="small"){
        const result=await SmallTournament.findById(id)
        .populate("tournamentCreator","name")
        .populate("tournamentPlayersList", "name clubHandicap handicap")
        .exec(); // Populate only the name of players

        return result
    }

}


module.exports={
    showMyEntered,
    showTournaemntById
}