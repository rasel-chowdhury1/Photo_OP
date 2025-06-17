const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../modules/User/user.model');

const usersData = [
  {
    "fullName": "Testing Admin",
    "email": "admin@photooprps.com",
    "phoneNumber": "01735566789",
    "password": "helloadmin@2024",
    "role": "admin"
  },
  {
    "fullName": "John Doe",
    "email": "helloboss3@gmail.com",
    "phoneNumber": "1234567890",
    "countryCode": "+1",
    "aboutMe": "Photographer and adventurer.",
    "identityImage": "/uploads/users/identity.jpg",
    "password": "hello123",
    "role": "user",
    "availability": {
      "day": ["Monday", "Wednesday", "Friday"],
      "startTime": "09:00",
      "endTime": "17:00"
    },
    "isDeleted": false
  },
  {
    "fullName": "Jane Smith",
    "email": "helloboss2@gmail.com",
    "phoneNumber": "+0987654321",
    "countryCode": "UK",
    "aboutMe": "Travel blogger and food lover.",
    "identityImage": "/uploads/users/identity.jpg",
    "password": "hello123",
    "role": "snapper",
    "availability": {
      "day": ["Tuesday", "Thursday"],
      "startTime": "10:00",
      "endTime": "16:00"
    },
    "snappingCompleted": 0,
    "ratings": 4.8,
    "adminApproval": "Approved",
    "isDeleted": false,
    "address": "221B Baker Street",
    "postCode": "NW1 6XE",
    "area": "Marylebone",
    "roadNo": "Baker Street",
    "city": "London"
  }
];

// Function to drop the entire database
const dropDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();
    console.log('------------> Database dropped successfully! <------------');
  } catch (err) {
    console.error('Error dropping database:', err);
  }
};

// Function to seed users
const seedUsers = async () => {
  try {
    await User.deleteMany();
    await User.insertMany(usersData);
    console.log('Users seeded successfully!');
  } catch (err) {
    console.error('Error seeding users:', err);
  }
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION);

// Call seeding functions
const seedDatabase = async () => {
  try {
    //clear the database
    await dropDatabase();
    await seedUsers();
    console.log('--------------> Database seeding completed <--------------');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    mongoose.disconnect();
  }
};

// Execute seeding
seedDatabase();
