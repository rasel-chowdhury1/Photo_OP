const { User } = require("../models");
const Location = require("../models/location.model");

/**
 * Create a new location
 * @param {Object} locationBody
 * @returns {Promise<Location>}
 */
const createLocation = async (locationBody) => {
  return Location.create(locationBody);
};

/**
 * Get locations by user ID
 * @param {ObjectId} userId
 * @returns {Promise<Location[]>}
 */
const getLocationsByUserId = async (userId) => {
  return Location.find({ userId }).sort({ createdAt: -1 });
};

/**
 * Get locations near a point
 * @param {Number[]} coordinates - [longitude, latitude]
 * @param {Number} maxDistance - Maximum distance in meters
 * @returns {Promise<Location[]>}
 */
const getLocationsNear = async (coordinates, maxDistance) => {
  return Location.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates,
        },
        $maxDistance: maxDistance,
      },
    },
  });
};

/**
 * Delete a location by ID
 * @param {ObjectId} locationId
 * @returns {Promise<Location>}
 */
const deleteLocation = async (locationId) => {
  return Location.findByIdAndDelete(locationId);
};


// current location update 

const updateCurrentLocation = async (id, locations) => {



    // Create the proper GeoJSON structure for currentLocation
    const data = {
      currentLocation: {
        type: "Point", // This is required for MongoDB to recognize it as a geospatial data type
        coordinates: [locations.longitude, locations.latitude],
      }
    };

  
    // Update the user's currentLocation
    const user = await User.findByIdAndUpdate(id, data, { new: true });
  
  

  return user;
};

module.exports = {
  createLocation,
  getLocationsByUserId,
  getLocationsNear,
  deleteLocation,
  updateCurrentLocation
};
