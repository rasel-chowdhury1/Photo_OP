const jwt = require("jsonwebtoken");
const logger = require("../../helpers/logger");

const socketAuthMiddleware = (socket, next) => {
  const token = socket.handshake.headers.authorization;
  if (!token) {
    return next(new Error('Authentication error: Token not provided.'));
  }

  // Extract the token from the Authorization header
  const tokenParts = token.split(' ');
  const tokenValue = tokenParts[1];

  // Verify the token
  if (tokenValue) {
    jwt.verify(tokenValue, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        console.error(err);
        logger.error(err, "-- socket.io authentication error --");
        return next(new Error('Authentication error: Invalid token.'));
      }
      socket.decodedToken = decoded;
      next();
    });
  } else {
    return next(new Error('Authentication error: Token not provided.'));
  }
};

module.exports = socketAuthMiddleware;
