const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    chatCreator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'SmallTournament', required: false },
    btournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: false },
    type: { 
        type: String, 
        enum: ['single', 'group'], 
        default: 'single' 
    },
    groupName: { type: String, trim: true, default: '' },
    groupImage: { type: String, trim: true, default: '' },  // New: Group image URL
    description: { type: String, trim: true, default: '' },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    groupAdmins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // New: Group admins
    isPinned: { type: Boolean, default: false }, // New: Option to pin important chats
    isDeleted: { type: Boolean, default: false } // New: Soft delete flag
}, { timestamps: true });



const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
module.exports = ChatRoom;