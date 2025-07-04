

const mongoose = require('mongoose');

// Define the location schema
const teeSheetSchema = new mongoose.Schema({
    name : {type:String,required:false},
    groupNumber : {type:Number,required:false},
    tournametId:{type:mongoose.Schema.Types.ObjectId,ref:"Tournament",required:false},
    smallTournametId:{type:mongoose.Schema.Types.ObjectId,ref:"SmallTournament",required:false},

    groupName : {type:String,required:true},
    playerList:[{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,default:[]}],
    teeSheetCreator:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},


   dateTime:{type:String,required:true}
    
   
    
}, { timestamps: true });



const TeeSheet = mongoose.model('TeeSheet', teeSheetSchema);
module.exports = TeeSheet;


