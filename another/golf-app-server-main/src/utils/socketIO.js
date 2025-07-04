const logger = require("../config/logger");
const ChatRoom = require("../models/chat.model");
const Message = require("../models/message.model");

const socketIO = (io) => {
  io.on("connection", (socket) => {
    console.log(`ID: ${socket.id} just connected`);

    socket.on("join-room", (data, callback) => {
      //console.log('someone wants to join--->', data);
      if (data?.roomId) {
        socket.join("room" + data.roomId);
        callback("Join room successful");
      } else {
        callback("Must provide a valid user id");
      }
    });

    socket.on("leave-room", (data) => {
      if (data?.roomId) {
        socket.leave("room" + data.roomId);
      }
    });


   // Handle sending messages
   socket.on("send-message", async (data, callback) => {
    try {
      const { roomId, senderId, message, media, messageType } = data;

      if (!roomId || !senderId || !message) {
        return callback({ status: "error", message: "Missing required fields" });
      }

      // Create a new message document
      const newMessage = new Message({
        chatRoomId: roomId,
        sender: senderId,
        message,
        media: media || "",
        messageType: messageType || "text",
      });

      // Save the message to MongoDB
      const savedMessage = await newMessage.save();

      // Populate sender details
      await savedMessage.populate("sender", "name image");

      // Update last message in chat room
      await ChatRoom.findByIdAndUpdate(roomId, { lastMessage: savedMessage._id });

      // Broadcast the message to all users in the room
      io.to("room" + roomId).emit("receive-message", savedMessage);

       // Emit the new message to the chat room
       const messageEvent = `newMessage::${roomId}`;
       io.emit(messageEvent, { success: true, data: {attributes:[savedMessage]} });
       console.log("this is message docket------------------",);
       
console.log(messageEvent);

      // Send success response to sender
      callback({ status: "success", message: "Message sent",  data: {attributes:[savedMessage]} });
    } catch (error) {
      console.error("Error sending message:", error);
      callback({ status: "error", message: "Message failed to send" });
    }
  });


    socket.on("disconnect", () => {
      console.log(`ID: ${socket.id} disconnected`);
    });
  });
};

module.exports = socketIO;
