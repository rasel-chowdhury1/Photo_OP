const { default: mongoose } = require("mongoose");
const logger = require("../../helpers/logger");
const { getParticipantLists } = require("../../modules/Chat/chat.service");

const getActiveUsers = async (socket, data, callback, activeUsers) => {
  try {
    // Use aggregation to find connected users
    const result = await getParticipantLists(socket.decodedToken._id);
    const connectedUserIds = result.length > 0 ? result[0].participantIds : [];

    // Convert ObjectId instances to strings for comparison
    const connectedUserIdsStr = connectedUserIds.map(id => id.toString());

    // Filter active users based on the connected user IDs
    const connectedUsers = Object.values(activeUsers).filter(user => connectedUserIdsStr.includes(user.id));
    callback({ status: "Success", data: connectedUsers });
  } 
  catch (error) {
    console.error("Error fetching connected users:", error);
    logger.error(error, "-- get-active-users error --");
    callback({ status: "Error", message: "Error fetching connected users" });
  }
};

module.exports = getActiveUsers;
