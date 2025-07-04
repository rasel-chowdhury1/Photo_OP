

const mongoose = require('mongoose');

// Define the location schema
const sponserTournamentSchema = new mongoose.Schema({
    sponserCreator: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'User', 
        required: false 
    },
    sponserImage:{type:Object,required:true},
    name:{type:String,required:true},
    location:{
        type: {
          type: String,
          enum: ["Point"],
          required: true,
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: true,
          default: [0, 0]      },
      },
      link:{type:String,required:true}
   
    
   
    
}, { timestamps: true })

sponserTournamentSchema.index({ location: '2dsphere' });


const SponserTournament = mongoose.model('SponserTournament', sponserTournamentSchema);
module.exports = SponserTournament;