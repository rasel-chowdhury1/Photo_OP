
const SmallTournament = require("../models/smallTournament.model")
const Tournament = require("../models/tournament.model")

// show all complite tournmanet 
//----------------------------------------------
const showAllCompliteTournament = async (id) => {
    const big = await Tournament.find({ tournamentCreator: id, isCompleted: true }).select("tournamentType iswinner tournamentCreator courseName time date typeName clubName tournamentName").sort({ updatedAt: -1 });
    const small = await SmallTournament.find({ tournamentCreator: id, isCompleted: true }).select("tournamentType iswinner tournamentCreator courseName time date typeName tournamentName").sort({ updatedAt: -1 });

    // Merge both results and sort by updatedAt in descending order
    const result = [...big, ...small].sort((a, b) => b.updatedAt - a.updatedAt);

    return result;
};

// show all the user in this tournaemtn 
//--------------------------------------------------



module.exports={
    showAllCompliteTournament
}