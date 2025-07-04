const httpStatus = require("http-status");
const Tournament = require("../models/tournament.model");
const ApiError = require("../utils/ApiError");
const { haversine } = require("../utils/distenceCalculate");
const { sendNotification } = require("../config/notifaction");


/**
 * Create a new tournament
 * @param {Object} tournamentBody - The tournament data to be created
 * @returns {Promise<Tournament>}
 */
const createTournament = async (tournamentBody,id) => {
 
    const tournamentExist = await Tournament.findOne({ clubName: tournamentBody.clubName });
    
    if (tournamentExist) {
      // Log the existing tournament for debugging
      console.log(tournamentExist);

      // Throw ApiError with the correct status code (409 Conflict)
      throw new ApiError(httpStatus.CONFLICT, "club name name already exists");
    }

    // Prepare the data object with proper coordinates
    const data = {
      ...tournamentBody, // Spread the tournamentBody object
      tournamentCreator:id,
      isApproved:true,
      
      courseLocation: {
        coordinates: [tournamentBody.longitude, tournamentBody.latitude], // Corrected names
      }
    }
    console.log(data);
    // Create a new tournament using the Tournament model
    const tournament = await Tournament.create(data);





    return tournament;
  
};


const querytournament = async ( options) => {
  const query = {};



  const users = await Tournament.paginate(query, options);

  // Convert height and age to feet/inches here...

  return users;
};




// const getTournaments = async (user, limit, page) => {
//   const userLocationCurrnet = user.currentLocation.coordinates; // [longitude, latitude] for current location
//   const userLocation = user.myLocation.coordinates; // [longitude, latitude] for the actual saved location

//   const userLocationCurrentPoint = {
//     type: 'Point',
//     coordinates: userLocationCurrnet
//   };

//   const userLocationPoint = {
//     type: 'Point',
//     coordinates: userLocation
//   };

//   const maxDistanceInMeters = 60000; // Example: maximum distance in meters (60 km)

//   // Step 1: Fetch nearby tournaments within the 60 km radius and apply pagination
//   const nearbyTournaments = await Tournament.aggregate([
//     {
//       $match: {
//         isApproved: true // Only include approved tournaments
//       }
//     },
//     {
//       $geoNear: {
//         near: userLocationCurrentPoint, // Use the current location for filtering
//         distanceField: "distance", // Store distance from the current location in 'distance' field
//         maxDistance: maxDistanceInMeters, // Max distance (60 km)
//         spherical: true // Use spherical calculations for accurate distance
//       }
//     },
//     {
//       $sort: { createdAt: -1 } // Sort tournaments by newest first
//     },
//     {
//       $skip: (page - 1) * limit // Pagination: skip based on the page number
//     },
//     {
//       $limit: limit // Limit the number of tournaments to fetch
//     }
//   ]);

//   // Step 2: Calculate the distance from the user's actual (saved) location to each tournament
//   const tournamentsWithDistance = nearbyTournaments.map(tournament => {
//     const tournamentLat = tournament.courseLocation.coordinates[1];
//     const tournamentLon = tournament.courseLocation.coordinates[0];

//     // Calculate the distance from the tournament to the user's saved location (userLocation)
//     const userLat = userLocation[1];
//     const userLon = userLocation[0];
//     const distanceToUser = haversine(userLat, userLon, tournamentLat, tournamentLon); // Get distance in km

//     // Calculate the distance from the tournament to the user's current location (userLocationCurrnet) using the distance already calculated by geoNear
//     const distanceToCurrentLocation = tournament.distance / 1000; // Convert meters to kilometers

//     return {
//       ...tournament,
//       distanceToCurrentLocation, // Distance from the current location
//       distanceToUser // Distance from the actual (saved) location
//     };
//   });


  
//   // Step 1: Fetch total count of tournaments within the 60 km radius
//   const totalTournaments = await Tournament.aggregate([
//     {
//       $geoNear: {
//         near: userLocationCurrentPoint,
//         distanceField: "distance",
//         maxDistance: maxDistanceInMeters,
//         spherical: true
//       }
//     },
//     {
//       $count: "totalCount" // Count total number of tournaments
//     }
//   ]);

//   const totalCount = totalTournaments.length > 0 ? totalTournaments[0].totalCount : 0;


//   // Return filtered tournaments with the updated pagination data
//   return { tournamentsWithDistance,totalCount };
// };


const getTournaments = async (user, limit, page) => {
  const userLocationCurrnet = user.currentLocation.coordinates; // [longitude, latitude] for current location
  const userLocation = user.myLocation.coordinates; // [longitude, latitude] for the actual saved location

  const userLocationCurrentPoint = {
    type: 'Point',
    coordinates: userLocationCurrnet
  };

  const maxDistanceInMeters = 60000; // Example: maximum distance in meters (60 km)

  // Step 1: Fetch nearby tournaments within the 60 km radius that are approved
  const nearbyTournaments = await Tournament.aggregate([
    {
      $geoNear: {
        near: userLocationCurrentPoint, // Use the current location for filtering
        distanceField: "distance", // Store distance from the current location in 'distance' field
        maxDistance: maxDistanceInMeters, // Max distance (60 km)
        spherical: true // Use spherical calculations for accurate distance
      }
    },
    {
      $match: {
        isApproved: true,
        isRejected:false // Only include approved tournaments
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

  // Step 2: Calculate the distance from the user's actual (saved) location to each tournament
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

  // Step 3: Fetch total count of approved tournaments within the 60 km radius
  const totalTournaments = await Tournament.aggregate([
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
        isRejected:false // // Only include approved tournaments
      }
    },
    {
      $count: "totalCount" // Count total number of tournaments
    }
  ]);

  const totalCount = totalTournaments.length > 0 ? totalTournaments[0].totalCount : 0;

  // Return filtered tournaments with the updated pagination data
  return { tournamentsWithDistance, totalCount };
};


/**
 * Get a tournament by ID
 * @param {ObjectId} tournamentId - The ID of the tournament to retrieve
 * @returns {Promise<Tournament>}
 */
const getTournamentById = async (tournamentId) => {
     // Find a tournament by its ID
    const tournament = await Tournament.findById(tournamentId);
    
    // If tournament not found, throw a custom error
    if (!tournament) {
      throw new ApiError(404, "Tournament not found");
    }

    return tournament;
 
};

/**
 * Update a tournament by ID
 * @param {ObjectId} tournamentId - The ID of the tournament to update
 * @param {Object} tournamentBody - The new data to update the tournament with
 * @returns {Promise<Tournament>}
 */
const updateTournament = async (tournamentId, tournamentBody) => {
  try {
    // Find and update the tournament by ID
    const updatedTournament = await Tournament.findByIdAndUpdate(tournamentId, tournamentBody, {
      new: true, // Return the updated tournament document
    });

    // If tournament not found, throw a custom error
    if (!updatedTournament) {
      throw new ApiError(404, "Tournament not found");
    }

    return updatedTournament;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error; // Rethrow custom ApiError
    }
    throw new Error("Error updating tournament: " + error.message);
  }
};

/**
 * Delete a tournament by ID
 * @param {ObjectId} tournamentId - The ID of the tournament to delete
 * @returns {Promise<Tournament>}
 */
const deleteTournament = async (tournamentId) => {
  try {
    // Find and delete the tournament by ID
    const deletedTournament = await Tournament.findByIdAndDelete(tournamentId);

    // If tournament not found, throw a custom error
    if (!deletedTournament) {
      throw new ApiError(404, "Tournament not found");
    }

    return deletedTournament;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error; // Rethrow custom ApiError
    }
    throw new Error("Error deleting tournament: " + error.message);
  }
};



// make requiest payemnt for the touranemnt

const makeRequestToPlay = async (tournamentId, userId) => {
  // Find the tournament by ID
  const tournament = await Tournament.findById(tournamentId);
 

  if (!tournament) {
    throw new ApiError(httpStatus.NOT_FOUND, "Tournament not found");
  }

  // Check if the tournament is already full
  if (tournament.tournamentPlayersList.length >= tournament.numberOfPlayers) {
    throw new ApiError(httpStatus.CONFLICT, "Tournament is already full");
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
    title: "New Tournament Join Request",
    body: `A new player has joined your tournament: ${tournament.name}`,
    type: "tournament",
    linkId: `/tournament/${tournamentId}`
  });

  return tournament;
};




// admin dashborde  for the tournament 
//--------------------------------------------------------
 // show all requested data for my small tournament 
  // -----------------------------------------------------------------------
  const showAllMyTournanmnetForRequest=async()=>{

    const allRequestsmallTournamet=await Tournament.find({isApproved:false,isRejected:false})

    return allRequestsmallTournamet

  }
  // show all requested data for my small tournament 
  // -----------------------------------------------------------------------
  const showAllTournanmnetForRequestAproved=async(id)=>{

    const allRequestsmallTournamet=await Tournament.findByIdAndUpdate(id,{isApproved:true,isRejected:false},{new:true})

    return allRequestsmallTournamet

  }
  // show all requested data for my small tournament 
  // -----------------------------------------------------------------------
  const showAllMyTournanmnetForRequestRejected=async(id)=>{

    const allRequestsmallTournamet=await Tournament.findByIdAndUpdate(id,{isRejected:true,isApproved:false},{new:true})

    return allRequestsmallTournamet

  }
  // show all requested data for my small tournament 
  // -----------------------------------------------------------------------
  const showallAprovedTourmant=async(id)=>{

    const allRequestsmallTournamet=await Tournament.find({isApproved:true})

    return allRequestsmallTournamet

  }
  // show all requested data for my small tournament 
  // -----------------------------------------------------------------------
  const showallRejectTourmant=async(id)=>{

    const allRequestsmallTournamet=await Tournament.find({isRejected:true})

    return allRequestsmallTournamet

  }

module.exports = {
  createTournament,
  getTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
  makeRequestToPlay,
  showallRejectTourmant,
  showallAprovedTourmant,
  showAllMyTournanmnetForRequestRejected,
  showAllTournanmnetForRequestAproved,
  showAllMyTournanmnetForRequest
};
