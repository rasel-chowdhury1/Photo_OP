import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cron = require('node-cron');

// Setup Express and Socket.io
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Define the schema for messages
const MessageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Create the model
const Message = mongoose.model('Message', MessageSchema);

// Global message array
const globalMessages = [];

// Handle socket connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for incoming messages
  socket.on('sendMessage', (message) => {
    // Push the received message into the global array
    globalMessages.push({
      content: message.content,
      sender: message.sender || 'unknown',
      timestamp: new Date(),
    });
    console.log(`Message received: ${message.content}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Cron job to process messages every second
cron.schedule('     ', async () => {
  if (globalMessages.length > 0) {
    console.log(`Processing ${globalMessages.length} messages...`);

    // Take a batch of 10 messages
    const batch = globalMessages.splice(0, 10);

    // Insert the batch into the database
    try {
      await Message.insertMany(batch);
      console.log(`Inserted ${batch.length} messages into the database.`);
    } catch (error) {
      console.error('Error inserting messages:', error);
    }
  } else {
    console.log('No messages to process.');
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/chatdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB.');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });


