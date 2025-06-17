const { getChatByParticipants, addChat } = require("../../modules/Chat/chat.service");
const logger = require("../../helpers/logger");

const addNewChat = async (socket, data, callback) => {
  try {
    let chat = {};
    if (data.participant) {
      if (chat.participant === socket.decodedToken._id.toString()) {
        return callback({
          status: "Error",
          message: "You can not chat with yourself",
        });
      }
      const existingChat = await getChatByParticipants(
        socket.decodedToken._id,
        data.participant
      );
      if (existingChat && existingChat.status === "accepted") {
        callback({
          status: "Success",
          chatId: existingChat._id,
          message: "Chat already exists",
        });
        return;
      }
      chat = await addChat(socket.decodedToken._id, data.participant);
      callback({
        status: "Success",
        chatId: chat._id,
        message: "Chat created successfully",
      });
    } else {
      callback({
        status: "Error",
        message: "Must provide at least 2 participants",
      });
    }
  } catch (error) {
    console.error("Error adding new chat:", error.message);
    logger.error("Error adding new chat:", error.message);
    callback({ status: "Error", message: error.message });
  }
};

module.exports = addNewChat;
