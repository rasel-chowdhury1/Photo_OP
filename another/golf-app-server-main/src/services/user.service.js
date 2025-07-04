const httpStatus = require("http-status");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const { sendEmailVerification } = require("./email.service");
const unlinkImages = require("../common/unlinkImage");

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  const oneTimeCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  if (userBody.role === "user" || userBody.role === "superUser") {

    sendEmailVerification(userBody.email, oneTimeCode);
  }
  const data = {
    ...userBody, // Spread the tournamentBody object
    oneTimeCode,
    myLocation: {
      coordinates: [userBody.longitude, userBody.latitude], // Corrected names
    }
  }

  return User.create(data);
};



const queryUsers = async (filter, options) => {
  const query = {};

  // Loop through each filter field and add conditions if they exist
  for (const key of Object.keys(filter)) {
    if (
      (key === "fullName" || key === "email" || key === "username") &&
      filter[key] !== ""
    ) {
      query[key] = { $regex: filter[key], $options: "i" }; // Case-insensitive regex search for name
    } else if (filter[key] !== "") {
      query[key] = filter[key];
    }
  }

  const users = await User.paginate(query, options);

  // Convert height and age to feet/inches here...

  return users;
};



const getUserById = async (id) => {
  return User.findById(id);
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const updateUserById = async (userId, updateBody, files) => {
  const user = await getUserById(userId);
  console.log(user,userId,files,updateBody);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  if (files && files.length > 0) {
    updateBody.photo = files;
  } else {
    delete updateBody.photo; // remove the photo property from the updateBody if no new photo is provided
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await user.remove();
  return user;
};

const isUpdateUser = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const oneTimeCode =
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;


  if (updateBody.role === "user" || updateBody.role === "supperUser") {
    sendEmailVerification(updateBody.email, oneTimeCode);
  }

  Object.assign(user, updateBody, {
    isDeleted: false,
    isSuspended: false,
    isEmailVerified: false,
    isResetPassword: false,
    isPhoneNumberVerified: false,
    oneTimeCode: oneTimeCode,
  });
  await user.save();
  return user;
};

// show all golfer in the  app
//--------------------------------------------------------
// const showAllGolfer = async () => {
//   // Fetch golfers based on the specified roles
//   const golfers = await User.find({
//     role: { $in: ["user", "basicUser", "supperUser"] }
//   }).select("name image city clubHandicap handicap")
//     .sort({ createdAt: -1 });

//   // Get the count of golfers
//   const totalGolferCount = golfers.length;

//   // Return both the list of golfers and the total count
//   return {
//     golfers,
//     totalGolferCount
//   };
// };
const showAllGolfer = async (nameFilter = '',userId) => {

  // Fetch the user's current location
  const myLocation = await User.findById(userId);
  
  if (!myLocation || !myLocation.currentLocation || !myLocation.currentLocation.coordinates) {
    throw new Error('User location is not available or improperly formatted');
  }

  const userLongitude = myLocation.currentLocation.coordinates[0];
  const userLatitude = myLocation.currentLocation.coordinates[1];

  // Build the query to find users within 60 km radius of the current user's location
  const query = {
    role: { $in: ["user", "basicUser", "superUser"] }, // Filter based on user roles
    currentLocation: {
      $near: {
        $geometry: {
          type: "Point",  // The type must be "Point"
          coordinates: [userLongitude, userLatitude], // [longitude, latitude]
        },
        $maxDistance: 60000,  // 60 km radius in meters (60000 meters)
      },
    },
  };
  // If a nameFilter is provided, add the filter to the query
  if (nameFilter) {
    query.name = { $regex: nameFilter, $options: 'i' }; // Case-insensitive match
  }

  // Fetch golfers with the query
  const golfers = await User.find(query)
    .select("name image city clubHandicap handicap")
    .sort({ createdAt: -1 });

  // Get the count of golfers
  const totalGolferCount = golfers.length;

  // Return both the list of golfers and the total count
  return {
    golfers,
    totalGolferCount
  };
};



module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  isUpdateUser,
  showAllGolfer
};