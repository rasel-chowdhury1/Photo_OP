

const mongoose = require('mongoose');

// Define the location schema
const lookingToPlaySchema = new mongoose.Schema({
    player: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'User', 
        required: false 
    },
    userName: {type:String,required:true},
    visitingFrom: {type:String,required:true},
    golfCourse: {type:String,required:true},
    cityToPlay: {type:String,required:true},
    fromDate:{type:String,required:true},
    tomDate:{type:String,required:true},

    
    isAccepted:{type:Boolean,default:false},
    isReject:{type:Boolean,default:false},
    
   
    
}, { timestamps: true });


const LookingToPlay = mongoose.model('LookingToPlay', lookingToPlaySchema);
module.exports = LookingToPlay;
