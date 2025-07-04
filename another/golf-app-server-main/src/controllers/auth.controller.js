const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const response = require("../config/response");
const {
  authService,
  userService,
  tokenService,
  emailService,
  locationService,
} = require("../services");
const { User } = require("../models");
const clearOtpAfterThreeMinutes = require("../utils/otpClear");


// this is register controller 
//-------------------------------------------------------------------------------
// -----------********************


const register = catchAsync(async (req, res) => {
  console.log(req.body);

  const isUser = await userService.getUserByEmail(req.body.email);
  console.log(isUser);

  // Extract latitude and longitude from the request body
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Latitude and longitude are required to register location"
    );
  }

  if (isUser && isUser.isVerified === false) {
    console.log("created");
    const user = await userService.isUpdateUser(isUser.id, req.body);

    // Add location for the user
    await locationService.createLocation({
      userId: user.id,
      location: {
        type: "Point",
        coordinates: [longitude, latitude], // GeoJSON format: [longitude, latitude]
      },
    });

    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).json(
      response({
        message: "Thank you for registering. Please verify your email",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: {},
      })
    );
  } else if (isUser && isUser.isDeleted === false) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  } else if (isUser && isUser.isDeleted === true) {
    const user = await userService.isUpdateUser(isUser.id, req.body);

    // Add location for the user
    await locationService.createLocation({
      userId: user.id,
      location: {
        type: "Point",
        coordinates: [longitude, latitude], // GeoJSON format: [longitude, latitude]
      },
    });

    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).json(
      response({
        message: "Thank you for registering. Please verify your email",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: {},
      })
    );
  } else {
    const user = await userService.createUser(req.body);
   


    // Clear OTP after 3 minutes
    clearOtpAfterThreeMinutes(user); // Call the function to clear OTP after 3 minutes


    // Add location for the user
    await locationService.createLocation({
      userId: user.id,
      location: {
        type: "Point",
        coordinates: [longitude, latitude], // GeoJSON format: [longitude, latitude]
      },
    });

    const tokens = await tokenService.generateAuthTokens(user);

    res.status(httpStatus.CREATED).json(
      response({
        message: "Thank you for registering. Please verify your email",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: {},
      })
    );
  }
});

// this is login controller 
//-------------------------------------------------------------------------------
// -----------********************

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const isUser = await userService.getUserByEmail(email);
  // here we check if the user is in the database or not
  if (isUser?.isDeleted === true) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This Account is Deleted");
  }
  if (isUser?.isVerified === false) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email not verified");
  }
  if (!isUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "No users found with this email");
  }
  const user = await authService.loginUserWithEmailAndPassword(email, password);

  setTimeout(async () => {
    try {
      user.oneTimeCode = null;
      user.isResetPassword = false;
      await user.save();
      console.log("oneTimeCode reset to null after 3 minute");
    } catch (error) {
      ApiError;
      console.error("Error updating oneTimeCode:", error);
    }
  }, 180000); // 3 minute in milliseconds

  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).json(
    response({
      message: "Login Successful",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { user, tokens },
    })
  );
});

const logout = catchAsync(async (req, res) => {
  // await authService.logout(req.body.refreshToken);
  // res.status(httpStatus.OK).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  // const tokens = await authService.refreshAuth(req.body.refreshToken);
  // res.send({ ...tokens });
});

// const forgotPassword = catchAsync(async (req, res) => {
//   const user = await userService.getUserByEmail(req.body.email);
//   if (!user) {
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       "No users found with this email"
//     );
//   }
//   // if(user.oneTimeCode === 'verified'){
//   //   throw new ApiError(
//   //     httpStatus.BAD_REQUEST,
//   //     "try 3 minute later"
//   //   );
//   // }
//   // Generate OTC (One-Time Code)
//   const oneTimeCode =
//     Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

//   // Store the OTC and its expiration time in the database
//   user.oneTimeCode = oneTimeCode;
//   user.isResetPassword = true;
//   await user.save();

//   //console.log("oneTimeCode", user);
//   await emailService.sendResetPasswordEmail(req.body.email, oneTimeCode);

//   // otp will null after 3 menites
//   clearOtpAfterThreeMinutes(user)
//   res.status(httpStatus.OK).json(
//     response({
//       message: "Email Sent",
//       status: "OK",
//       statusCode: httpStatus.OK,
//       data: {},
//     })
//   );
// });


const forgotPassword = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.body.email);
  if (!user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No users found with this email"
    );
  }

  // Generate OTC (One-Time Code)
  const oneTimeCode =
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  // Store the OTC and its expiration time in the database
  user.oneTimeCode = oneTimeCode;
  user.isResetPassword = true;
  
  // Save the user (No need to wait for this, can be run in parallel with email sending)
  user.save();

  // Send the reset password email in parallel
  emailService.sendResetPasswordEmail(req.body.email, oneTimeCode)
    .then(() => {
      // OTP will be null after 3 minutes
      clearOtpAfterThreeMinutes(user);
    })
    .catch((error) => {
      console.error("Error sending email:", error);
    });

  res.status(httpStatus.OK).json(
    response({
      message: "Email Sent",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

const resetPassword = catchAsync(async (req, res) => {

  const user=req.user.email
  console.log(user);
  await authService.resetPassword(req.body.password, user);
  res.status(httpStatus.OK).json(
    response({
      message: "Password Reset Successful",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

const changePassword = catchAsync(async (req, res) => {
  await authService.changePassword(req.user, req.body);
  res.status(httpStatus.OK).json(
    response({
      message: "Password Change Successful",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.OK).send();
});

// resend  controller  
//---------------------------------------------------------------
//==============#####################


/**
 * Resend OTP to the user's email
 */
const resendOtp = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email is required");
  }

  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  
  clearOtpAfterThreeMinutes(user)
  if(user.oneTimeCode!==null){
    throw new ApiError(400, "you already have otp check the your email");

  }

  
  await authService.resendOtp({user});
  console.log(user);
 
  res.status(httpStatus.OK).json({
    status: "success",
    message: "OTP has been resent to your email",
  });
});


const verifyEmail = catchAsync(async (req, res) => {
  const user = await authService.verifyEmail(req.body, req.query);

  const tokens = await tokenService.generateAuthTokens(user);

  res.status(httpStatus.OK).json(
    response({
      message: "Email Verified",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { user, tokens },
    })
  );
  // res.status(httpStatus.OK).send();
});

const deleteMe = catchAsync(async (req, res) => {
  const user = await authService.deleteMe(req.body.password, req.user);
  res.status(httpStatus.OK).json(
    response({
      message: "Account Deleted",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { user },
    })
  );
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  resendOtp,
  deleteMe,
  changePassword,
};
