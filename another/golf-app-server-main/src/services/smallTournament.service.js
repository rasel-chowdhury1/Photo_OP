const httpStatus = require("http-status")
const SmallTournament = require("../models/smallTournament.model")
const ApiError = require("../utils/ApiError")
const { haversine } = require("../utils/distenceCalculate")
const { sendNotification } = require("../config/notifaction")

// small tornament create services
//------------------------------------------------------------------------------
const createSmmallTournament=async(tournametBody,id)=>{

   // Prepare the data object with proper coordinates
   const data = {
    ...tournametBody, // Spread the tournamentBody object
    tournamentCreator:id,
    isApproved:true,
    courseLocation: {
      coordinates: [tournametBody.longitude, tournametBody.latitude], // Corrected names
    }
  }

    const smallTournament=await SmallTournament.create(data)

    return smallTournament

}

// small tornament services  get all
//------------------------------------------------------------------------------

// const getAllsmallTournament=async(user, limit, page)=>{
//     const userLocation = user.myLocation.coordinates; // [longitude, latitude]

//   const userLocationPoint = {
//     type: 'Point',
//     coordinates: userLocation
//   };

//   // Use aggregation to perform the geo query with sorting
//   const nearbyTournaments = await SmallTournament.aggregate([
//     {
//       $geoNear: {
//         near: userLocationPoint, // Specify the user's location as the reference point
//         distanceField: "distance", // This will store the distance from the user's location in the 'distance' field
//         maxDistance: 60000, // 60 km = 60000 meters
//         spherical: true // Make sure the distance is calculated in spherical coordinates (for accuracy)
//       }
//     },
//     {
//       $skip: (page - 1) * limit // Pagination: skip based on the page number
//     },
//     {
//       $limit: limit // Limit the number of tournaments to fetch
//     }
//   ]);

//   // Get the total number of tournaments (for pagination metadata)
//   const totalTournaments = await SmallTournament.countDocuments({
//     courseLocation: {
//       $geoWithin: {
//         $centerSphere: [userLocationPoint.coordinates, 60 / 3963.2]  // 60 km radius (in radians)
//       }
//     }
//   });

//   return { nearbyTournaments, totalTournaments };

// }
// getAllsmallTournament.js (or wherever your service is)



const getAllsmallTournament = async (user, limit, page) => {
  const userLocationCurrnet = user.currentLocation.coordinates; // [longitude, latitude] for current location
  const userLocation = user.myLocation.coordinates; // [longitude, latitude] for the actual saved location

  const userLocationCurrentPoint = {
    type: 'Point',
    coordinates: userLocationCurrnet
  };

  const userLocationPoint = {
    type: 'Point',
    coordinates: userLocation
  };

  const maxDistanceInMeters = 60000; // Example: maximum distance in meters (60 km)

  // Use aggregation to perform the geo query with sorting by proximity
  const nearbyTournaments = await SmallTournament.aggregate([
    {
      $geoNear: {
        near: userLocationCurrentPoint, // Use the current location for filtering
        distanceField: "distance", // This will store the distance from the user's location in 'distance' field
        maxDistance: maxDistanceInMeters, // Max distance (60 km)
        spherical: true // Use spherical calculations for accurate distance
      }
    },
    {
      $match: {
        isApproved: true,
        isRejected:false // 
      }
    },
    {
      $sort: { createdAt: -1 } // Sort tournaments by newest first
    },
    {
      $skip: (page - 1) * limit // Pagination: skip based on the page number
    },
    {
      $limit: limit // Limit the number of tournaments to fetch
    }
  ]);

  // Add the distance from the user's actual (saved) location to each tournament
  const tournamentsWithDistance = nearbyTournaments.map(tournament => {
    const tournamentLat = tournament.courseLocation.coordinates[1];
    const tournamentLon = tournament.courseLocation.coordinates[0];

    // Calculate the distance from the tournament to the user's saved location (userLocation)
    const userLat = userLocation[1];
    const userLon = userLocation[0];
    const distanceToUser = haversine(userLat, userLon, tournamentLat, tournamentLon); // Get distance in km

    // Calculate the distance from the tournament to the user's current location (userLocationCurrnet) using the distance already calculated by geoNear
    const distanceToCurrentLocation = tournament.distance / 1000; // Convert meters to kilometers

    return {
      ...tournament,
      distanceToCurrentLocation, // Distance from the current location
      distanceToUser // Distance from the actual (saved) location
    };
  });

  // Step 1: Fetch total count of tournaments within the 60 km radius
  const totalTournaments = await SmallTournament.aggregate([
    {
      $geoNear: {
        near: userLocationCurrentPoint,
        distanceField: "distance",
        maxDistance: maxDistanceInMeters,
        spherical: true
      }
    },
    {
      $match: {
        isApproved: true,
        isRejected:false // 
      }
    },
    {
      $count: "totalCount" // Count total number of tournaments
    }
  ]);

  const totalCount = totalTournaments.length > 0 ? totalTournaments[0].totalCount : 0;

  return { tournamentsWithDistance, totalCount };
};



/**
 * Get a tournament by ID
 * @param {ObjectId} tournamentId - The ID of the tournament to retrieve
 * @returns {Promise<SmallTournament>}
 */
const getSmallTournamentById = async (tournamentId) => {
 
      // Find a tournament by its ID
      const tournament = await SmallTournament.findById(tournamentId);
      
      // If tournament not found, throw a custom error
      if (!tournament) {
        throw new ApiError(404, "Tournament not found");
      }
  
      return tournament;

  };

  // requiest to play for the user

  
const makeRequestToPlay = async (tournamentId, userId) => {
    // Find the tournament by ID
    const tournament = await SmallTournament.findById(tournamentId);
    console.log(tournament);
   
  
    if (!tournament) {
      throw new ApiError(httpStatus.NOT_FOUND, "Tournament not found");
    }
  
    // Check if the tournament is already full
    if (tournament.tournamentPlayersList.length >= tournament.numberOfPlayers) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Tournament is already full");
    }
  
    // Check if the user is already in the tournament
    if (tournament.tournamentPlayersList.includes(userId)) {
      throw new ApiError(httpStatus.CONFLICT, "you  already registered in this tournament");
    }
  
    // Add user to tournamentPlayersList
    tournament.tournamentPlayersList.push(userId);
    await tournament.save();

    await sendNotification({
      sender: userId,
      receiver: tournament.tournamentCreator,
      tournamentId,
      title: "New small outing touranment Join Request",
      body: `A new player has joined your small outing: ${tournament.name}`,
      type: "tournament",
      linkId: `/small-tournament/${tournamentId}`
    });
  
  
    return tournament;
  };


  // for the admin 

  //-----------------------------------------------------------------------------------------------

  // show all requested data for my small tournament 
  // -----------------------------------------------------------------------
  const showAllMySmallTournanmnetForRequest=async()=>{

    const allRequestsmallTournamet=await SmallTournament.find({isApproved:false,isRejected:false})

    return allRequestsmallTournamet

  }
  // show all requested data for my small tournament 
  // -----------------------------------------------------------------------
  const showAllMySmallTournanmnetForRequestAproved=async(id)=>{

    const allRequestsmallTournamet=await SmallTournament.findByIdAndUpdate(id,{isApproved:true,isRejected:false},{new:true})

    return allRequestsmallTournamet

  }
  // show all requested data for my small tournament 
  // -----------------------------------------------------------------------
  const showAllMySmallTournanmnetForRequestRejected=async(id)=>{

    const allRequestsmallTournamet=await SmallTournament.findByIdAndUpdate(id,{isRejected:true,isApproved:false},{new:true})

    return allRequestsmallTournamet

  }
  // show all requested data for my small tournament 
  // -----------------------------------------------------------------------
  const showallAprovedsmallTourmant=async(id)=>{

    const allRequestsmallTournamet=await SmallTournament.find({isApproved:true})

    return allRequestsmallTournamet

  }
  // show all requested data for my small tournament 
  // -----------------------------------------------------------------------
  const showallRejectsmallTourmant=async(id)=>{

    const allRequestsmallTournamet=await SmallTournament.find({isRejected:true})

    return allRequestsmallTournamet

  }
module.exports={
    createSmmallTournament,
    getAllsmallTournament,
    getSmallTournamentById,
    makeRequestToPlay,
    showAllMySmallTournanmnetForRequest,
    showAllMySmallTournanmnetForRequestAproved,
    showAllMySmallTournanmnetForRequestRejected,
    showallAprovedsmallTourmant,
    showallRejectsmallTourmant
    
}