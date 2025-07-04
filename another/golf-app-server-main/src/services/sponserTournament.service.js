const { SponserTournament } = require("../models");
const { getUserById } = require("./user.service");


// create  sponser tournament 
//--------------------------------------------------------------------------
const createSponserTournament=async(userId,data) =>{

    const datas={
        ...data,
        sponserCreator:userId,
        location: {
            coordinates: [data.longitude, data.latitude], // Corrected names
          }
        
       
    }

    const result=await SponserTournament.create(datas)

    return result

}

// updated sopnser tournament 
//-----------------------------------------------------------


// Update sponsor tournament service
const updateSponserTournament = async (sponserId, data) => {
  const updateData = { ...data };

  // If coordinates are provided, update location
  if (data.longitude && data.latitude) {
    updateData.location = {
      type: "Point",
      coordinates: [data.longitude, data.latitude],
    };
  }

  // Find and update the tournament
  const updatedTournament = await SponserTournament.findByIdAndUpdate(
    sponserId,
    updateData,
    { new: true, runValidators: true }
  );

  return updatedTournament;
};



// show all sponser tournament 
//-----------------------------------------------------------------------------


const showAllsponserTournament = async (userId) => {
    // Fetch user by ID to get their current location
    const user = await getUserById(userId);

    // Check if the user has a valid location
    if (!user || !user.currentLocation || !user.currentLocation.coordinates) {
        throw new Error("User location not found");
    }

    const maxDistanceInMeters = 60000; // 60 km (in meters)

    console.log("User Location:", user.currentLocation.coordinates, "Max Distance:", maxDistanceInMeters);

    // GeoSpatial query to find tournaments within 60 km
    const allTournaments = await SponserTournament.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",  // GeoJSON type
                    coordinates: user.currentLocation.coordinates, // User's current location
                },
                distanceField: "distance", // The field to store the distance from the user
                maxDistance: maxDistanceInMeters, // Limit to 60 km
                spherical: true, // Enables spherical calculations for distance
            }
        },
        {
            $sort: { distance: 1 },  // Sort tournaments by distance (nearest first)
        },
        {
            $limit: 10  // Limit the results to 10 tournaments (you can change this value)
        }
    ]);

    // // Check if tournaments were found
    // if (!allTournaments || allTournaments.length === 0) {
    //     throw new Error("No tournaments found within 60 km");
    // }

    // console.log("Found Tournaments:", allTournaments);

    return allTournaments; // Return the list of tournaments within the specified distance
};

  

module.exports={
    createSponserTournament,
    showAllsponserTournament,
    updateSponserTournament
}