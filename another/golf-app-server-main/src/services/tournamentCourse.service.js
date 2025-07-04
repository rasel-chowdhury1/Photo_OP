


const SmallTournament = require("../models/smallTournament.model")
const Tournament = require("../models/tournament.model")
const TournamentCourse = require("../models/tournamentCourse.model")

// create tournamnet course serivices
//------------------------------------------------------------------
const createTournamentCoursSerivce=(async(courseData)=>{

    const isCoureseExist=await TournamentCourse.findOne({courseName:courseData.courseName})
    if(!isCoureseExist){
        const coursecreate=TournamentCourse.create(courseData)

        return coursecreate

    }


})

// make all the tournaemnt is compliete
//------------------------------------------------------------

const makeTournaemntIsComplite=async(id,type)=>{
   

    if(type==="big"){

    const result =await Tournament.findByIdAndUpdate(id,{isCompleted:true},{new:true})
    return result

    }
    if(type==="small"){

    const result =await SmallTournament.findByIdAndUpdate(id,{isCompleted:true},{new:true})
    return result

    }
}

module.exports={
    createTournamentCoursSerivce,
    makeTournaemntIsComplite
}