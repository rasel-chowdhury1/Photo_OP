const { app, responseTimes } = require('./app');
require('dotenv').config();
const mongoose = require('mongoose');
const { createServer } = require('http');
const logger = require('./helpers/logger');
const socketIO = require('./socket/socketIO.js');
const socket = require('socket.io');
const { logResponseTimes } = require('./helpers/apiResponceTime.js');
// const setupAgenda = require('./agenda-tasks/agenda.js');

// Create a new server specifically for Socket.io
const socketServer = createServer();
let server = null;

// Initialize Socket.io with the new server instance
const io = socket(socketServer, {
  cors: {
    origin: '*'
  },
  reconnection: true,
  reconnectionAttempts: 2,
  reconnectionDelay: 1000
});

const port = process.env.BACKEND_PORT || 3001;
const socketPort = process.env.SOCKET_PORT || 3002;
const serverIP = process.env.API_SERVER_IP || 'localhost';

// let agenda;

async function myServer() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION);

    // Start Express server
    server = app.listen(port, serverIP, () => {
      console.dir(`---> Photo OP server is listening on : http://${serverIP}:${port}`);
    });

    // Start Socket.io server
    socketServer.listen(socketPort, serverIP, () => {
      console.dir(`---> Socket server is listening on   : http://${serverIP}:${socketPort}`);
    });

    // agenda = setupAgenda(io);

    // Set up Socket.io event handlers
    socketIO(io);
    global.io = io;
  } catch (error) {
    console.error('Server start error:', error);
    logger.error(error, '---server.js---');
    process.exit(1);
  }
}

myServer();

async function graceful(err) {
  console.error('Received shutdown signal or error:', err);
  logger.error(err, '--- graceful shutdown ---');
  logResponseTimes(responseTimes);

  // if (agenda) {
  //   await agenda.stop();
  // }

  if (server) {
    server.close(() => {
      console.log('Server closed. Exiting process.');
      process.exit(0);
    });
  }
  if (socketServer) {
    socketServer.close(() => {
      console.log('Socket server closed. Exiting process.');
      process.exit(0);
    });
  }
}

process.on('SIGINT', graceful);
process.on('SIGTERM', graceful);
process.on('uncaughtException', graceful);