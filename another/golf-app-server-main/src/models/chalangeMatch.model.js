


const mongoose = require('mongoose');

// Define the location schema
const chalangeMatchSchema = new mongoose.Schema({
    tournamentCreator: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'User', 
        required: false 
    },
   bigTournament: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'Tournament', 
        required: false 
    },
    smallTournament: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'SmallTournament', 
        required: false 
    },
    gagleName:{type:String,reuired:true},
    playeare1:   { 
        type: mongoose.Schema.ObjectId, 
        ref: 'User', 
        required: false 
    },
    playeare2:   { 
        type: mongoose.Schema.ObjectId, 
        ref: 'User', 
        required: false 
    },
    date:{type:String,required:true,},
    time:{type:String,required:true,},
    courseName:{type:String,required:true,}
}, { timestamps: true });



const ChalangeMatch = mongoose.model('ChalangeMatch', chalangeMatchSchema);
module.exports = ChalangeMatch;
