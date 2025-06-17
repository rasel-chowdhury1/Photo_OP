const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: [true, 'Name must be given'], trim: true },
  email: { type: String, required: false, trim: true },
  phoneNumber: { type: String, required: false, trim: true },
  countryCode: { type: String, required: false },
  aboutMe: { type: String, required: false },
  image: { type: String, required: false, default: '/uploads/users/user.jpg' },
  //NID or Passport image
  identityImage: { type: String, required: false, default: '/uploads/users/identity.jpg' },
  password: { type: String, required: false, set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)) },
  role: { type: String, enum: ['admin', 'user', 'snapper'], default: 'user' },
  availability: {
    day: [{ type: String, required: false }],
    startTime: { type: String, required: false },
    endTime: { type: String, required: false }
  },
  snappingCompleted: { type: Number, default: 0 },
  hourlyRate: { type: Number, default: 0 },
  ratings: { type: Number, default: 0.0 },
  adminApproval: { type: String, enum:["Pending", "Approved", "Blocked"], default: "Pending"},
  isDeleted: { type: Boolean, default: false },
  // location: { 
  //   type: {
  //     type: String, 
  //     enum: ['Point'], 
  //     default: 'Point'
  //   },
  //   coordinates: {
  //     type: [Number],
  //     required: false,
  //   },
  // }
  address: { type: String, required: false },
  postCode: { type: String, required: false },
  area: { type: String, required: false },
  roadNo: { type: String, required: false },
  city: { type: String, required: false },
},
  {
    timestamps: true
  }
);

// Create the geospatial index
// userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
