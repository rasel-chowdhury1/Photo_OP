const mongoose = require('mongoose');

// Define the subscription schema
const subscribeSchema = new mongoose.Schema({
    // userId: { 
    //     type: mongoose.Schema.ObjectId, 
    //     ref: 'User', 
    //     required: false 
    // },
    subscribeType: { 
        type: String, 
        enum: ['basicUser', 'superUser'], 
        required: true ,
        unique: true  // Ensure the subscribeType is unique across all subscriptions

    },
    price: { 
        type: Number, 
        required: true 
    },
    features: [
        
             { type: String } 
        
    ], // Corrected the 'features' field to be an array of objects with a 'text' key
    typeOfSubscription: { 
        type: String, 
        enum: ['month', 'year'], 
    }
}, { timestamps: true });

const Subscribe = mongoose.model('Subscribe', subscribeSchema);
module.exports = Subscribe;
