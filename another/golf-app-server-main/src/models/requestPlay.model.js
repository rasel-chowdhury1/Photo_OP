

const mongoose = require('mongoose');

// Define the location schema
const requestToPlaySchema= new mongoose.Schema({
    requestedUser: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'User', 
        required: true 
    },
    tournamentcreator: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'User', 
        required: true 
    },
    tournament: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'Tournament', 
        required: false 
    },
    smallTournament: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'SmallTournament', 
        required: false 
    },

    tournamentType:{type:String,required:true},
    isAccepted:{type:Boolean,default:false},
    isCancale:{type:Boolean,default:false},
    standBy:{type:String,required:false}
    
   
    
}, { timestamps: true });


const RequestToPlay = mongoose.model('RequestToPlay', requestToPlaySchema);
module.exports = RequestToPlay;
