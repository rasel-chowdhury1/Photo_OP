

const mongoose = require('mongoose');

// Define the location schema
const invitationSchema = new mongoose.Schema({
    player: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'User', 
        required: false 
    },
    inviteSender: { 
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

    tournamentType:{type:String,required:true},
    isAccepted:{type:Boolean,default:false},
    isRejected:{type:Boolean,default:false},
    
   
    
}, { timestamps: true });



const Invitation = mongoose.model('Invitation', invitationSchema);
module.exports = Invitation;


