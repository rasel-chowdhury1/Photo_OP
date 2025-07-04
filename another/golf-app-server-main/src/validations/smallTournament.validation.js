const Joi = require("joi");

const smallTournamentValidation = {
  body: Joi.object().keys({
 
    tournamentName: Joi.string().optional(),
    tournamentType: Joi.string().required(),
    date: Joi.string().required(),
    time: Joi.string().required(),
    city: Joi.string().required(),
    courseName: Joi.string().required(),
    longitude: Joi.string().required(),
    latitude: Joi.string().required(),
    courseRating: Joi.number().required(),
    slopeRating: Joi.number().required(),
    numberOfPlayers: Joi.number().required(),
    handicapToRange: Joi.number().required(),
    handicapFromRange: Joi.number().required(),
   
    tournamentImage: Joi.object().optional() // Validate image separately if needed
  }),
};

module.exports={
    smallTournamentValidation
}