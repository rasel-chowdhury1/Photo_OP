const mongoose = require('mongoose');

// Define the Message schema
const MessageSchema = new mongoose.Schema({
    chatRoomId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ChatRoom', 
        required: true 
    },
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    message: { 
        type: String, 
        required: true, 
        trim: true 
    },
    media: { 
        type: String, 
        trim: true, 
        default: ''  // URL of the media if any (image, video, etc.)
    },
    messageType: { 
        type: String, 
        enum: ['text', 'image', 'video', 'file'], 
        default: 'text'  // Specify the type of the message
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    // editedAt: { 
    //     type: Date, 
    //     default: null 
    // },
    isDeleted: { 
        type: Boolean, 
        default: false  // Soft delete flag for messages
    }
}, { timestamps: true });

// Create the Message model
const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
