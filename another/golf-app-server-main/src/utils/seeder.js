const mongoose = require("mongoose");
const { User } = require("../models");
const { Privacy, Terms, AboutUs, Contact } = require("../models/setting.model");
require("dotenv").config();
// const { Service, User } = require("../models");

// Sample data

const usersData = [
  {
    name: "Testing Admin",
    email: "admin@gmail.com",
    password: "$2a$08$cUQ3uMdbQjlyDF/dgn5mNuEt9fLJZqq8TaT9aKabrFuG5wND3/mPO",
    role: "admin",
    isVerified: true,
    city: "Dhaka",
    state: "Dhaka",
    gender: "male",

    country: "Bangladesh",
    handicap: "Intermediate",
    clubHandicap: "Intermediate",
    myLocation: {
      type: "Point",
      coordinates: [90.41040616391045, 23.78544782748652], // longitude, latitude
    },
  },
  {
    name: "Testing Admin1",
    email: "admin1@gmail.com",
    password: "$2a$08$cUQ3uMdbQjlyDF/dgn5mNuEt9fLJZqq8TaT9aKabrFuG5wND3/mPO",
    role: "admin",
    isVerified: true,
    city: "Chittagong",
    state: "Chittagong",
    country: "Bangladesh",
    handicap: "Beginner",
    clubHandicap: "Beginner",
    gender: "male",
    myLocation: {
      type: "Point",
      coordinates: [91.7983, 22.3569],
    },
  },
  {
    name: "Testing User",
    email: "user@gmail.com",
    password: "$2a$08$cUQ3uMdbQjlyDF/dgn5mNuEt9fLJZqq8TaT9aKabrFuG5wND3/mPO",
    role: "user",
    isVerified: true,
    city: "Sylhet",
    state: "Sylhet",
    gender: "male",

    country: "Bangladesh",
    handicap: "Beginner",
    clubHandicap: "Beginner",
    myLocation: {
      type: "Point",
      coordinates: [91.8672, 24.8990],
    },
  },
  {
    name: "Testing Client",
    email: "supperuser@gmail.com",
    password: "$2a$08$cUQ3uMdbQjlyDF/dgn5mNuEt9fLJZqq8TaT9aKabrFuG5wND3/mPO",
    role: "supperUser",
    isVerified: true,
    city: "Dhaka",
    state: "Dhaka",
    gender: "male",

    country: "Bangladesh",
    handicap: "Advanced",
    clubHandicap: "Advanced",
    myLocation: {
      type: "Point",
      coordinates: [90.4125, 23.8103],
    },
  },
  {
    name: "Basic User",
    email: "basicuser@gmail.com",
    password: "$2a$08$cUQ3uMdbQjlyDF/dgn5mNuEt9fLJZqq8TaT9aKabrFuG5wND3/mPO",
    role: "supperUser",
    isVerified: true,
    city: "Khulna",
    state: "Khulna",
    gender: "male",

    country: "Bangladesh",
    handicap: "Intermediate",
    clubHandicap: "dssdfs",
    myLocation: {
      type: "Point",
      coordinates: [89.5667, 22.8456],
    },
  },
];



// Seed data
const privacyData = [
  {
    privacyText: "This is the privacy policy text for our application.",
  },
];

const termsData = [
  {
    termsText: "These are the terms and conditions for using our application.",
  },
];

const aboutUsData = [
  {
    aboutUsText: "Welcome to our application. We are committed to providing you with the best experience.",
  },
];

const contactData = [
  {
    email: "support@yourapp.com",
  },
];





// Function to drop the entire database
const dropDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();
    console.log("------------> Database dropped successfully! <------------");
  } catch (err) {
    console.error("Error dropping database:", err);
  }
};

// Function to seed users
const seedUsers = async () => {
  try {
    await User.deleteMany();
    await User.insertMany(usersData);
    // Seed the data

    // Clear existing data
    await Privacy.deleteMany({});
    await Terms.deleteMany({});
    await AboutUs.deleteMany({});
    await Contact.deleteMany({});
    console.log("Existing data cleared");

    // Insert seed data
    await Privacy.insertMany(privacyData);
    console.log("Privacy data seeded successfully");

    await Terms.insertMany(termsData);
    console.log("Terms data seeded successfully");

    await AboutUs.insertMany(aboutUsData);
    console.log("About Us data seeded successfully");

    await Contact.insertMany(contactData);
    console.log("Contact data seeded successfully");

    console.log("Users seeded successfully!");
  } catch (err) {
    console.error("Error seeding users:", err);
  }
};


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL);

// Call seeding functions
const seedDatabase = async () => {
  try {
    await dropDatabase();
    await seedUsers();
    // await seedSubscriptions();
    console.log("--------------> Database seeding completed <--------------");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    mongoose.disconnect();
  }
};

// Execute seeding
seedDatabase();
