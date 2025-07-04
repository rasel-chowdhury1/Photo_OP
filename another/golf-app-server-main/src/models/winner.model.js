
const mongoose = require('mongoose');

// Define the skin schema
const skinSchema = new mongoose.Schema({
    winnerCreator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // renamed for consistency
    tournament: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament" },
    skinWinner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    skinHole: { type: Number, },
    skinScore: { type: String },
    skinIsPaid: { type: Boolean, default: false }, // Default to false
    skinPaidAmount: { type: Number ,required:false}, // Default to false
});


// Create and export the skin model
//-------------------------------------------------------------------------------
const Skin = mongoose.model("Skin", skinSchema);
module.exports.Skin = Skin;



// Define the kps schema
const kpsSchema = new mongoose.Schema({
    winnerCreator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // renamed for consistency
    tournament: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament" },
    kpsWinner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    kpsHole: { type: String },
    // kpsScore: { type: Number },
    kpsFeet: { type: Number },
});



// Create and export the kps model

const Kps = mongoose.model("Kps", kpsSchema);
module.exports.Kps = Kps;


// Define the challenge match schema
//------------------------------------------------------------------------------------
const challengeMatchSchema = new mongoose.Schema({
    winnerCreator: { type: mongoose.Schema.Types.ObjectId, ref: "User",retuired:true }, // renamed for consistency
    tournament: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament" },
    challengeWinner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    winnerRound: { type: Number },
    challengeLoser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    loserRound: { type: Number },
});

// Create and export the challenge match model
const ChallengeMatch = mongoose.model("ChallengeMatch", challengeMatchSchema);
module.exports.ChallengeMatch = ChallengeMatch;

// Define the player score schema
const playerScoreSchema = new mongoose.Schema({
    winnerCreator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // renamed for consistency
    tournament: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament" },
    name: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  
    handicapIndex:{type:Number,default:0},
    score: { type: Number },
});

// Create and export the player score model
const PlayerScore = mongoose.model("PlayerScore", playerScoreSchema);
module.exports.PlayerScore = PlayerScore;








// // Define the winner schema
// const winnerSchema = new mongoose.Schema({
//     winnerCreator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // renamed for consistency
//     tournament: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament" },
    
//     skin: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skin" }],
//     kps: [{ type: mongoose.Schema.Types.ObjectId, ref: "Kps" }],
//     challengeMatch: [{ type: mongoose.Schema.Types.ObjectId, ref: "ChallengeMatch" }],
//     playerScore: [{ type: mongoose.Schema.Types.ObjectId, ref: "PlayerScore" }]
// }, { timestamps: true }); // added timestamps for creation and modification times

// // Create the winner model
// const Winner = mongoose.model("Winner", winnerSchema);
// module.exports.Winner = Winner;
