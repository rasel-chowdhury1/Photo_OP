const mongoose = require('mongoose');


// Define the service schema
const tournamentCourseSchema = new mongoose.Schema({


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
    courseRating:{type:Number,required:true},
    slopeRating:{type:Number,required:true},
    
   

},{
    timestamps:true
})
// Add geospatial indexes
tournamentCourseSchema.index({ courseLocation: "2dsphere" });

const TournamentCourse = mongoose.model("TournamentCourse", tournamentCourseSchema);

module.exports = TournamentCourse;