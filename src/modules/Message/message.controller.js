const httpStatus = require("http-status");
const catchAsync = require("../../helpers/catchAsync");
const response = require("../../helpers/response");
const { getMessages, deleteMessage } = require("./message.service");

const getAllMessages = catchAsync(async (req, res) => {
  const options = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10
  }
  const chatId = req.query.chatId;
  if (!chatId) {
    return res.status(400).json(response({ message: "ChatId is required in params", status: "Error", statusCode: "400" }));
  }
  const result = await getMessages(chatId, options);
  return res.status(httpStatus.OK).json(response({ message: "Messages", status: "OK", statusCode: httpStatus.OK, data: result }));
});

module.exports = {
  getAllMessages,
};
