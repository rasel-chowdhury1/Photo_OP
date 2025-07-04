const { User } = require("../models")

// show all the top player 
//-------------------------------------


const topplayear = async (userId) => {
    // Fetch the user's location
    const userLocation = await User.findById(userId);
    if (!userLocation || !userLocation.currentLocation || !userLocation.currentLocation.coordinates) {
      throw new Error('User location is not available or improperly formatted');
    }
  
    // Get the coordinates from the user's location
    const location = userLocation.currentLocation.coordinates;
  
    // Query all golfers within a 60 km radius (60000 meters) and sort by handicap numerically
    const result = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",  // Type must be "Point"
            coordinates: location,  // [longitude, latitude]
          },
          distanceField: "distance",
          maxDistance: 60000,  // 60 km radius (60000 meters)
          spherical: true,
        },
      },
      {
        $addFields: {
          handicapNumber: {
            $toDouble: {
              $ifNull: [
                {
                  $cond: {
                    if: { $regexMatch: { input: "$handicap", regex: /^[+-]?\d+(\.\d+)?$/ } },
                    then: "$handicap",  // If it’s a valid numeric string, use it
                    else: "NaN",  // If not, assign NaN to avoid errors
                  },
                },
                "NaN",  // If handicap is null, use "NaN"
              ],
            },
          },
        },
      },
      {
        $sort: {
          handicapNumber: 1,  // Sort by the numeric value of handicap (ascending)
        },
      },
      {
        $limit: 50,  // Limit the results to the top 50 players
      },
      {
        $project: {
          name: 1,
          image: 1,
          handicap: 1,
          city:1,
          clubName:1,
          distance: 1,
        },
      },
    ]);
  
    return result;
  };
  
  
  

module.exports={
    topplayear
}