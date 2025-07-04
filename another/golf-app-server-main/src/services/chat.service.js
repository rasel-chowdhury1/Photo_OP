const ChatRoom = require("../models/chat.model")
const Message = require("../models/message.model")
const SmallTournament = require("../models/smallTournament.model")
const Tournament = require("../models/tournament.model")
const { ObjectId } = require('mongodb'); // Import ObjectId from MongoDB


// chat services for single chat 
//------------------------------------
const createsingleChat = async (creator, data) => {
    // Add the creator to the participants array
    data.participants.push(creator);

    // Check if a chat already exists with the same participants
    const existingChat = await ChatRoom.findOne({
        participants: { $all: data.participants },
        type: "single"
    });


    // If a chat already exists, return a 200 response without creating a new chat
    if (existingChat) {
        return {
            status: 200,
          
             existingChat
        };
    }

    // Proceed with creating the new chat if no existing chat is found
    const datas = {
        ...data,
        chatCreator: creator,
    };

    const result = await ChatRoom.create(datas);

    // Optionally create an initial message
    const initialMessage = new Message({
        chatRoomId: result._id,
        sender: creator,
        message: result.type === 'group' ? 'Welcome to the group!' : 'Hello!',
    });

    await initialMessage.save();

    // Update the chat room with the last message reference
    result.lastMessage = initialMessage._id;
    await result.save();

    return {
        status: 201,
      
         result
    };
};



// const createGroupChat = async (userId, data) => {
//     const isBigTournament = data.type === "big";
//     const tournamentId = data.tournamentid;

//     // Fetch tournament details based on type (big or small)
//     const tournament = isBigTournament 
//         ? await Tournament.findById(tournamentId) 
//         : await SmallTournament.findById(tournamentId);

//     // Check if a group chat already exists based on tournament type
//     let existingChat = isBigTournament
//         ? await ChatRoom.findOne({ btournamentId: tournamentId })
//         : await ChatRoom.findOne({ stournamentId: tournamentId });

//     // Add tournamentCreator as a participant (if not already included)
//     const tournamentCreator = tournament.tournamentCreator;
//     const newParticipants = data.newParticipants || [];

//     // Prepare the list of all participants, ensuring the creator is added only once
//     // Include only participants from tournamentPlayersList and newParticipants excluding creator
//     const allParticipants = [
//         tournamentCreator, 
//         ...newParticipants.filter(participant => participant !== tournamentCreator)
//     ];

//     console.log( allParticipants,"all perticepnt");
//     // Ensure unique participants (removing duplicates)
//     const uniqueParticipants = Array.from(new Set(allParticipants));
//     console.log( uniqueParticipants,"this is unique");

//     // Check if a chat already exists
//     if (existingChat) {
//         // If a group chat already exists, update it
//         const chatRoom = existingChat;  // Existing chat room

//         // Add new participants (if they aren't already in the list)
//         uniqueParticipants.forEach((participant) => {
//             if (!chatRoom.participants.includes(participant)) {
//                 chatRoom.participants.push(participant);
//             }
//         });

//         // Save the updated chat room
//         await chatRoom.save();

//         // Return the updated chat room
//         return {
//             status: 200,
//             chatRoom: chatRoom
//         };
//     } else {
//         // If no group chat exists, create a new one

//         // Initialize the participants with the tournament players list, ensuring no duplicates
//         let participants = [
//             ...new Set([...tournament.tournamentPlayersList])  // Remove duplicates
//         ];

//         console.log(participants,"dkdslkfjlksd");
//         // Create the new chat room data
//         const chatRoomData = {
//             ...data,
//             [isBigTournament ? 'btournamentId' : 'stournamentId']: tournamentId,  // Ensure the tournament ID is included
//             chatCreator: tournamentCreator,  // Set the creator as chat creator
//             type: 'group',  // Group chat type
//             groupAdmins: [tournamentCreator],  // Set the creator as the admin
//             participants,  // Include all tournament participants without duplicates
//         };

//         // Create the group chat
//         const newChatRoom = await ChatRoom.create(chatRoomData);
       

//         // Optionally create an initial message
//         const initialMessage = new Message({
//             chatRoomId: newChatRoom._id,
//             sender: tournamentCreator,
//             message: newChatRoom.type === 'group' ? 'Welcome to the group!' : 'Hello!',
//         });

//         await initialMessage.save();

//         // Update the chat room with the last message reference
//         newChatRoom.lastMessage = initialMessage._id;
//         await newChatRoom.save();

//         // Return the newly created chat room
//         return {
//             status: 201,
//             chatRoom: newChatRoom
//         };
//     }
// };




// show all chat by the user id 
//----------------------------------------

const createGroupChat = async (userId, data) => {
    const isBigTournament = data.type === "big";
    const tournamentId = data.tournamentid;

    // Fetch tournament details based on type (big or small)
    const tournament = isBigTournament 
        ? await Tournament.findById(tournamentId) 
        : await SmallTournament.findById(tournamentId);

    // Check if a group chat already exists based on tournament type
    let existingChat = isBigTournament
        ? await ChatRoom.findOne({ btournamentId: tournamentId })
        : await ChatRoom.findOne({ stournamentId: tournamentId });

    // Add tournamentCreator as a participant (if not already included)
    const tournamentCreator = tournament.tournamentCreator;
    const newParticipants = data.newParticipants || [];

    // Prepare the list of all participants, ensuring the creator is added only once
    const allParticipants = [
        tournamentCreator, 
        ...newParticipants.filter(participant => participant !== tournamentCreator) // Remove duplicate creators from new participants
    ];
   

    // Ensure unique participants (removing duplicates)
    const uniqueParticipants = Array.from(new Set(allParticipants));
 

    // Ensure no duplicates in the tournamentPlayersList and exclude the creator from the list if already included
    const cleanedTournamentPlayersList = Array.from(new Set(tournament.tournamentPlayersList)).filter(playerId => playerId !== tournamentCreator);
  

    // Merge cleaned tournament players with the new participants and ensure uniqueness
    const participants = Array.from(new Set([...cleanedTournamentPlayersList, ...uniqueParticipants]));
    
    

    // Check if a chat already exists
    if (existingChat) {
        // If a group chat already exists, update it
        const chatRoom = existingChat;  // Existing chat room
        

        // Add new participants (if they aren't already in the list)
        participants.forEach((participant) => {
            if (!chatRoom.participants.includes(participant)) {
                chatRoom.participants.push(participant);
            }
        });

        // Save the updated chat room
        await chatRoom.save();

        // Return the updated chat room
        return {
            status: 200,
            chatRoom: chatRoom
        };
    } else {
        // If no group chat exists, create a new one


        // Ensure uniqueness by converting ObjectId to strings
        const uniqueParticipantss = [...new Set(participants.map(id => id.toString()))].map(id => new ObjectId(id));
        // Create the new chat room data
        const chatRoomData = {
            ...data,
            [isBigTournament ? 'btournamentId' : 'stournamentId']: tournamentId,  // Ensure the tournament ID is included
            chatCreator: tournamentCreator,  // Set the creator as chat creator
            type: 'group',  // Group chat type
            groupAdmins: [tournamentCreator],  // Set the creator as the admin
            participants:uniqueParticipantss,  // Include all tournament participants without duplicates
        };
       

        // Create the group chat
        const newChatRoom = await ChatRoom.create(chatRoomData);

        // Optionally create an initial message
        const initialMessage = new Message({
            chatRoomId: newChatRoom._id,
            sender: tournamentCreator,
            message: newChatRoom.type === 'group' ? 'Welcome to the group!' : 'Hello!',
        });

        await initialMessage.save();

        // Update the chat room with the last message reference
        newChatRoom.lastMessage = initialMessage._id;
        await newChatRoom.save();

        // Return the newly created chat room
        return {
            status: 201,
            chatRoom: newChatRoom
        };
    }
};

// show my chat 
//----------------------------------------------------------
const showMyCaht = async (userId) => {
    // Fetch the chat rooms where the user is a participant and exclude soft-deleted ones
    const result = await ChatRoom.find({ participants: userId, isDeleted: false })
    .populate({
        path: "lastMessage",
        select: "message media",
        populate: {
            path: "sender",
            select: "name", // Only fetch sender's name
        }
    })
    .populate("participants","name image")
    .select("_id participants chatCreator btournamentId type isPinned") 
    .sort({ isPinned: -1, updatedAt: -1 }) // Sort by pinned first, then by latest update

    .exec();
    return result;
}


module.exports={
    createsingleChat,
    createGroupChat,
    showMyCaht
}