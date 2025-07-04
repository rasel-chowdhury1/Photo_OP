const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const Token = require("../models/token.model");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const { sendEmailVerification } = require("./email.service");
const clearOtpAfterThreeMinutes = require("../utils/otpClear");


const loginUserWithEmailAndPassword = async (email, password) => {
  // console.log("email", email);
  const user = await userService?.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};


const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  await refreshTokenDoc.remove();
};


const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};


const resetPassword = async (newPassword, email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (await user.isPasswordMatch(newPassword)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "New password cannot be the same as old password"
    );
  }
  await userService.updateUserById(user.id, { password: newPassword });

  return user;
};

// chagepassword servicess 
//---------------------------------------------------------------
//==============#####################
const changePassword = async (reqUser, reqBody) => {
  const { oldPassword, newPassword } = reqBody;
  const user = await userService.getUserByEmail(reqUser.email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (!(await user.isPasswordMatch(oldPassword))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect password");
  }
  if (await user.isPasswordMatch(newPassword)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "New password cannot be the same as old password"
    );
  }
  user.password = newPassword;
  await user.save();


  return user;
};

//verify emial servicess 
//---------------------------------------------------------------
//==============#####################
const verifyEmail = async (reqBody, reqQuery) => {
  const { email, oneTimeCode } = reqBody;
  console.log("reqBody", email);
  console.log("reqQuery", oneTimeCode);
  const user = await userService.getUserByEmail(email);
  // console.log("user", user);

  // if(user.oneTimeCode === 'verified'){
  //   throw new ApiError(
  //     httpStatus.BAD_REQUEST,
  //     "try 3 minute later"
  //   );
  // }
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  } else if (user.oneTimeCode === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP expired");
  } else if (oneTimeCode != user.oneTimeCode) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  } else if (user.isEmailVerified && !user.isResetPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already verified");
  } else {
    user.isVerified = true;
    user.oneTimeCode = null;
    user.isResetPassword = false;
    await user.save();
    return user;
  }
};


// re send opt servicess 
//---------------------------------------------------------------
//==============#####################

/**
 * Resend OTP to the user's email
 * @param {string} userId
 * @returns {Promise<void>}
 */
const resendOtp = async ({user}) => {
  // Fetch user by ID

  const oneTimeCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

    sendEmailVerification(user.email, oneTimeCode);
    await User.findByIdAndUpdate(user.id,{oneTimeCode:oneTimeCode},{new:true})

  // const user=await User.findOne({email})
  return oneTimeCode;
};





// verify servicess 
//---------------------------------------------------------------
//==============#####################

const verifyNumber = async (phoneNumber, otpCode, email) => {
  console.log("reqBody", email);
  console.log("reqQuery", otpCode);
  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  } else if (user.phoneNumberOTP === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP expired");
  } else if (otpCode != user.phoneNumberOTP) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  } else if (user.isPhoneNumberVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Phone Number already verified");
  } else {
    user.isPhoneNumberVerified = true;
    user.phoneNumberOTP = null;
    await user.save();
    return  user;
  }
};
// delete  servicess 
//---------------------------------------------------------------
//==============#####################

const deleteMe = async (password, reqUser) => {
  const user = await userService.getUserByEmail(reqUser.email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (!(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect password");
  }
  user.isDeleted = true;
  await user.save();
  return user;
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  resendOtp,
  deleteMe,
  changePassword,
  verifyNumber,
};
