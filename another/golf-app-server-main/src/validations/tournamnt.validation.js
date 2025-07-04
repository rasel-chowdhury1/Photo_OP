const Joi = require("joi");

const tournamentValidation = {
  body: Joi.object().keys({
    clubName: Joi.string().required(),
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
    gaggleLength: Joi.number().required(),
    tournamentImage: Joi.object().optional() // Validate image separately if needed
  }),
};

module.exports={
    tournamentValidation
}