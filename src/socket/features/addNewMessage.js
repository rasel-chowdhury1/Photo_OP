const { addMessage } = require("../../modules/Message/message.service");
const { getChatByParticipantId } = require("../../modules/Chat/chat.service");
const logger = require("../../helpers/logger");

const addNewMessage = async (socket, data, callback) => {
  try {
    const message = await addMessage(data);

    if (message) {
      //broadcast the message to the chatroom
      //by this, if another person is Online, he will just get the message
      const chatRoom = "new-message::" + data.chat.toString();
      socket.broadcast.emit(chatRoom, message);

      //update the chatlist of the both participants
      const eventName1 = 'update-chatlist::' + message?.chat?.participants[0].toString();
      const eventName2 = 'update-chatlist::' + message?.chat?.participants[1].toString();

      const chatListforUser1 = await getChatByParticipantId({ participantId: message?.chat?.participants[0] }, { page: 1, limit: 10 });
      const chatListforUser2 = await getChatByParticipantId({ participantId: message?.chat?.participants[1] }, { page: 1, limit: 10 });

      socket.emit(eventName1, chatListforUser1);
      socket.emit(eventName2, chatListforUser2);

      callback({
        status: "Success",
        message: message.message,
      });

      return;
    } else {
      return callback({
        status: "Error",
        message: "Something went wrong",
      });
    }
  } catch (error) {
    console.error("Error adding new message:", error.message);
    logger.error("Error adding new message:", error.message);

    if (typeof callback === "function") {
      callback({ status: "Error", message: error.message });
    } else {
      console.error("Callback is not a function");
      logger.error("Callback is not a function");
    }
  }
};

module.exports = addNewMessage;
