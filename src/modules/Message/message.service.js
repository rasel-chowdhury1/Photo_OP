const Message = require("./message.model");

const addMessage = async (messageBody) => {
  const newMessge = await Message.create(messageBody);
  return newMessge.populate('chat', 'participants')
};

const getMessages = async (chatId, options) => {
  const { limit = 10, page = 1 } = options; // Set default limit and page values

  const totalResults = await Message.countDocuments({
    chat: chatId,
  });

  const totalPages = Math.ceil(totalResults / limit); // Calculate total pages

  const pagination = { totalResults, totalPages, currentPage: page, limit }; // Create pagination object
  const skip = (page - 1) * limit; // Calculate skip value

  const messages = await Message.find({
    chat: chatId,
  })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate('sender', 'fullName image');

  return { messages, pagination };
};

const deleteMessage = (id) => {
  return Message.findByIdAndDelete(id);
}

const deleteMessagesByChatId = async (chatId) => {
  return await Message.deleteMany({ chat: chatId });
}

module.exports = {
  addMessage,
  getMessages,
  deleteMessage,
  deleteMessagesByChatId
};
