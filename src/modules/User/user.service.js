const httpStatus = require('http-status');
const ApiError = require('../../helpers/ApiError');
const User = require('./user.model');
const bcrypt = require('bcrypt');

const addUser = async (userBody) => {
  const user = new User(userBody);
  const savedUser = await user.save();
  return savedUser;
}

const getUserById = async (id) => {
  const userDetails = await User.findById(id);
  if(!userDetails){
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return userDetails;
}

const getSpecificDetails = async (id, select) => {
  return await User.findById(id).select(select);
}

const getUserByEmail = async (email) => {
  return await User.findOne({ email });
}

const login = async (email, password, purpose) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return null;
  }
  return user;
}

const deleteAccount = async (userId) => {
  const userData = await User.findById(userId);
  if (userData) {
    userData.email = userData.email + " (Account is deleted), Joining Time: " + userData.createdAt;
    userData.fullName = "Dialogi User"
    userData.image = `/uploads/users/deletedAccount.png`
    userData.isDeleted = true;
    userData.save();
  }
  return
}

const updateUser = async (userId, userbody) => {
  return await User.findByIdAndUpdate(userId, userbody, { new: true });
}

const getUsers = async (filter, options) => {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;
  const userList = await User.find(filter).skip(skip).limit(limit).sort({ snappingCompleted: -1 });
  const totalResults = await User.countDocuments(filter);
  const totalPages = Math.ceil(totalResults / limit);
  const pagination = { totalResults, totalPages, currentPage: page, limit };
  return { userList, pagination };
}

const getMonthlyUsersnapperRatio = async (year) => {
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31T23:59:59`);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const result = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          role: "$role"
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: "$_id.month",
        roles: {
          $push: {
            role: "$_id.role",
            count: "$count"
          }
        }
      }
    },
    {
      $project: {
        month: "$_id",
        userCount: {
          $cond: {
            if: { $gt: [{ $size: { $filter: { input: "$roles", as: "role", cond: { $eq: ["$$role.role", "user"] } } } }, 0] },
            then: { $arrayElemAt: [{ $filter: { input: "$roles", as: "role", cond: { $eq: ["$$role.role", "user"] } } }, 0] },
            else: { role: "user", count: 0 }
          }
        },
        snapperCount: {
          $cond: {
            if: { $gt: [{ $size: { $filter: { input: "$roles", as: "role", cond: { $eq: ["$$role.role", "snapper"] } } } }, 0] },
            then: { $arrayElemAt: [{ $filter: { input: "$roles", as: "role", cond: { $eq: ["$$role.role", "snapper"] } } }, 0] },
            else: { role: "snapper", count: 0 }
          }
        }
      }
    },
    {
      $project: {
        month: 1,
        user: "$userCount.count",
        snapper: "$snapperCount.count"
      }
    },
    {
      $sort: { month: 1 }
    }
  ]);

  // Initialize the result array with all months and counts set to 0
  const formattedResult = months.map((month, index) => {
    const data = result.find(r => r.month === index + 1) || { month: index + 1, user: 0, snapper: 0 };
    return {
      month: month,
      user: data.user,
      snapper: data.snapper
    };
  });

  return formattedResult;
};

const findNearestSnappers = async (userId , coordinates, radius = 5) => {
  // Convert radius from kilometers to meters
  const maxDistance = radius * 1000;

  // Use Mongoose's geospatial query to find nearby snappers
  const nearbySnappers = await User.find({
    role: 'snapper', // Filter to ensure we only find 'snapper' users
    _id: { $ne: userId }, // Exclude the current user
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates,
        },
        $maxDistance: maxDistance, // Maximum distance in meters
      },
    },
    isDeleted: false // Ensure the snapper is not marked as deleted
  });
  return nearbySnappers;
};

module.exports = {
  addUser,
  login,
  getUserById,
  updateUser,
  getUserByEmail,
  deleteAccount,
  getUsers,
  getSpecificDetails,
  getMonthlyUsersnapperRatio,
  findNearestSnappers
}
