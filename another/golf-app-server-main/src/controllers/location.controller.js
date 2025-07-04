const httpStatus = require("http-status");
const { locationService, userService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const { date } = require("joi");
const response = require("../config/response");


/**
 * Create a new location
 */
const createLocation = async (req, res) => {
  const location = await locationService.createLocation(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Location Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: location,
    })
  );
};

/**
 * Get locations by user ID
 */
const getLocationsByUserId = async (req, res) => {
  const locations = await locationService.getLocationsByUserId(req.params.userId);
  res.status(httpStatus.OK).json(
    response({
      message: "Locations Retrieved",
      status: "OK",
      statusCode: httpStatus.OK,
      data: locations,
    })
  );
};

/**
 * Get locations near a point
 */
const getLocationsNear = async (req, res) => {
  const { longitude, latitude, maxDistance } = req.query;

  if (!longitude || !latitude || !maxDistance) {
    return res.status(httpStatus.BAD_REQUEST).json(
      response({
        message: "Invalid query parameters",
        status: "ERROR",
        statusCode: httpStatus.BAD_REQUEST,
      })
    );
  }

  const locations = await locationService.getLocationsNear(
    [parseFloat(longitude), parseFloat(latitude)],
    parseFloat(maxDistance)
  );
  res.status(httpStatus.OK).json(
    response({
      message: "Locations Retrieved",
      status: "OK",
      statusCode: httpStatus.OK,
      data: locations,
    })
  );
};

/**
 * Delete a location by ID
 */
const deleteLocation = async (req, res) => {
  await locationService.deleteLocation(req.params.locationId);
  res.status(httpStatus.OK).json(
    response({
      message: "Location Deleted",
      status: "OK",
      statusCode: httpStatus.OK,
    })
  );
};

// update user location controller 

const updateUserLoaction=catchAsync(async(req,res)=>{

const id=req.user._id

const result=await locationService.updateCurrentLocation(id,req.body)

res.status(httpStatus.OK).json(
  response({
    message: "Location updated successfully",
    status: "OK",
    statusCode: httpStatus.OK,
    data:result
  })
);
})
module.exports = {
  createLocation,
  getLocationsByUserId,
  getLocationsNear,
  deleteLocation,
  updateUserLoaction
};
