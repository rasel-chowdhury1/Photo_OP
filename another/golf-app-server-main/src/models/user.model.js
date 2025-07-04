const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("./plugins");
const { roles } = require("../config/roles");


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: 1,
      maxlength: 300,
    },
    email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
              if (!validator.isEmail(value)) {
                throw new Error("Invalid email");
              }
            },
          },
    role: {
      type: String,
      required: true,
      enum:roles
     
    },
    password: {
      type: String,
      required: false,
      minlength: [8, "Password must be at least 8 characters long"],
    },
    phone: { type: String, required: false, default: "0124544" },
    address: { type: String, required: false, default: null },
    dateOfBirth: { type: String, required: false, default: null },
    city: { type: String, required: true },
    state: { type: String, required: true },
    gender: { type: String, required: true },
    country: { type: String, required: true },
    myWalet: { type: String, required: false },
    handicap: { type: String, required: true },
    clubHandicap: { type: String,required:false,default:"" },
    clubName:{type:String,required:false,default:""},
    facebookLink:{type:String,required:false,default:""},
    instagramLink:{type:String,required:false,default:""},
    linkdinLink:{type:String,required:false,default:""},
    xLink:{type:String,required:false,default:""},
    myLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: false,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: false,
        default: [0, 0]      },
    },
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: false,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: false,
        default: [0, 0]      },
    },
    privacyPolicyAccepted: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isResetPassword: { type: Boolean, default: false },
    isSubscribe: { type: Boolean, default: false },
    isAprovedAsSupperUser: { type: Boolean, default: false },
    teebox:{type:String,default:"blue"},
    image: {
            type: Object,
            required: [true, "Image is must be Required"],
            default: { url: `/uploads/users/user.png`, path: "null" },
          },
    coverImage: {
            type: Object,
            required: [true, "Image is must be Required"],
            default: { url: `/uploads/users/user.png`, path: "null" },
          },
    fcmToken: { type: String, required: false },
    oneTimeCode: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: {
                transform(doc, ret) {
                    delete ret.password;
                },
            },
  }
);

// Add geospatial indexes
userSchema.index({ currentLocation: "2dsphere", myLocation: "2dsphere" });


// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};
userSchema.statics.isPhoneNumberTaken = async function (
  phoneNumber,
  excludeUserId
) {
  const user = await this.findOne({ phoneNumber, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
