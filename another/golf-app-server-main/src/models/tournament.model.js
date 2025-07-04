const mongoose = require('mongoose');


// Define the service schema
const tournamentSchema = new mongoose.Schema({

    clubName:{type:String,required:true ,
},
    tournamentCreator:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    tournamentPlayersList:[{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,default:[]}],
    
    tournamentName:{type:String,required:false},
    tournamentType:{type:String,required:true},
    typeName:{type:String,default:"big"},

    date:{type:String,required:true},
    time:{type:String,required:true},
    city:{type:String,required:true},
    courseName:{type:String,required:true},
    courseLocation:{
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
      isApproved:{type:Boolean,default:false},
      isRejected:{type:Boolean,default:false},
      isClose:{type:Boolean,default:false},
      isCompleted:{type:Boolean,default:false},
      iswinner:{type:Boolean,default:false},

    courseRating:{type:Number,required:true},
    slopeRating:{type:Number,required:true},
    numberOfPlayers:{type:Number,required:true},
    gaggleLength:{type:Number,required:true},
    tournamentImage: {
        type: Object,
        required: [true, "Image is must be Required"],
        // default: { url: `/uploads/tournament/user.png`, path: "null" },
      },

},{
    timestamps:true
})

// // add plugin that converts mongoose to json
// tournamentSchema.plugin(toJSON);
// tournamentSchema.plugin(paginate);

tournamentSchema.index({ courseLocation: "2dsphere" });

const Tournament = mongoose.model("Tournament", tournamentSchema);

module.exports = Tournament;