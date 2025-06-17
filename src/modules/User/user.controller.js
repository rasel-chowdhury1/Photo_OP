require('dotenv').config();
const catchAsync = require('../../helpers/catchAsync')
const response = require("../../helpers/response");
const jwt = require('jsonwebtoken');
require('dotenv').config();
//defining unlinking image function 
const unlinkImage = require('../../helpers/unlinkImage')
const { addUser, login, getUserByEmail, getUserById, getUsers, getSpecificDetails, getMonthlyUsersnapperRatio, updateUser, findNearestSnappers } = require('./user.service')
const { sendOTP, checkOTPByEmail, verifyOTP, deleteOTP } = require('../Otp/otp.service');
const { addToken, verifyToken, deleteToken } = require('../Token/token.service');
const crypto = require('crypto');
const { getTopReviewOfsnapper } = require('../Review/review.service');
const { getLimitedPortFolios } = require('../Portfolio/portfolio.service');

//Sign up
const signUp = catchAsync(async (req, res) => {
  var otpPurpose = 'email-verification';
  var { fullName, email, phoneNumber, password, role, countryCode, address, postCode, area, roadNo, city } = req.body;
  const existingOTP = await checkOTPByEmail(email);
  var message = req.t('otp-sent');
  if (existingOTP) {
    message = req.t('otp-exists');
  }
  else {
    const otpData = await sendOTP(fullName, email, 'email', otpPurpose);
    if (otpData) {
      message = req.t('otp-sent');
    }
  }

  const signUpData = { fullName, email, phoneNumber, password, role, countryCode, address, postCode, area, roadNo, city }

  const signUpToken = jwt.sign(signUpData, process.env.JWT_ACCESS_TOKEN, { expiresIn: '1h' });

  return res.status(201).json(response({ status: 'OK', statusCode: '201', type: 'user', message: message, signUpToken: signUpToken }));
});

//Sign in
const signIn = catchAsync(async (req, res) => {
  //Get email password from req.body
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json(response({ statusCode: '200', message: req.t('login-credentials-required'), status: "OK" }));
  }

  const user = await login(email, password, 'signIn');
  if (user && !user?.isBlocked) {

    const token = jwt.sign({ userFullName: user.fullName, _id: user._id, email: user.email, role: user.role, image: user.image }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '1y' });

    return res.status(200).json(response({ statusCode: '200', message: req.t('login-success'), status: "OK", type: "user", data: user, accessToken: token }));
  }
  return res.status(404).json(response({ statusCode: '400', message: req.t('login-failed'), status: "OK" }));
});

const validateEmail = catchAsync(async (req, res) => {
  var otpPurpose = 'email-verification';
  const { otp, userData } = req.body;
  console.log(userData);
  const otpData = await verifyOTP(userData.email, 'email', otpPurpose, otp);
  if (!otpData) {
    return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'user', message: req.t('invalid-otp') }));
  }
  const registeredUser = await addUser(userData);

  const accessToken = jwt.sign({ userFullName: registeredUser.fullName, _id: registeredUser._id, email: registeredUser.email, role: registeredUser.role, image: registeredUser.image }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '1y' });

  await deleteOTP(otpData._id);

  return res.status(201).json(response({ status: 'OK', statusCode: '201', type: 'user', message: req.t('user-verified'), data: registeredUser, accessToken: accessToken }));
});

const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await getUserByEmail(email)
  if (!user) {
    return res.status(404).json(response({ status: 'Error', statusCode: '404', type: 'user', message: req.t('user-not-exists') }));
  }
  const otpData = await sendOTP(user.fullName, email, 'email', 'forget-password');
  if (otpData) {
    return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'user', message: req.t('forget-password-sent'), data: otpData }));
  }
  return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'user', message: req.t('forget-password-error') }));
}
)

const verifyForgetPasswordOTP = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(404).json(response({ status: 'Error', statusCode: '404', type: 'user', message: req.t('user-not-exists') }));
  }
  const otpVerified = await verifyOTP(email, 'email', 'forget-password', otp);
  if (!otpVerified) {
    return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'user', message: req.t('invalid-otp') }));
  }
  const token = crypto.randomBytes(32).toString('hex');
  const data = {
    token: token,
    userId: user._id,
    purpose: 'forget-password'
  }
  await addToken(data);
  return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'user', message: req.t('otp-verified'), forgetPasswordToken: token }));

})

const resetPassword = catchAsync(async (req, res) => {
  var forgetPasswordToken
  if (req.headers['forget-password'] && req.headers['forget-password'].startsWith('Forget-password ')) {
    forgetPasswordToken = req.headers['forget-password'].split(" ")[1];
  }
  if (!forgetPasswordToken) {
    return res.status(401).json(response({ status: 'Error', statusCode: '400', type: 'user', message: req.t('unauthorised') }));
  }

  const tokenData = await verifyToken(forgetPasswordToken, 'forget-password');
  if (!tokenData) {
    return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'user', message: req.t('invalid-token') }));
  }
  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(404).json(response({ status: 'Error', statusCode: '404', type: 'user', message: req.t('user-not-exists') }));
  }
  user.password = password;
  await user.save();
  await deleteToken(tokenData._id);
  return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'user', message: req.t('password-reset-success') }));
})

const userDetails = catchAsync(async (req, res) => {
  const userDetails = await getUserById(req.body.userId);
  return res.status(200).json(response({ statusCode: '200', message: req.t('user-details'), data: userDetails, status: "OK" }));
})

const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const verifyUser = await login(req.body.userEmail, oldPassword, 'changePass');
  if (!verifyUser) {
    return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'user', message: req.t('password-invalid') }));
  }
  verifyUser.password = newPassword;
  await verifyUser.save();
  return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'user', message: req.t('password-changed'), data: verifyUser }));

})

const updateProfile = catchAsync(async (req, res) => {
  req.body.data = JSON.parse(req.body.data || "{}");
  const user = await getUserById(req.body.userId);
  if (!user) {
    return res.status(404).json(response({ status: 'Error', statusCode: '404', type: 'user', message: req.t('user-not-exists') }));
  }
  console.log('-------->', req.body)
  Object.assign(user, req.body.data);
  if (req.files) {
    const { profileImage, identityImage } = req.files;
    if (profileImage && profileImage.length > 0) {
      const defaultPath1 = '/uploads/users/user.png';
      const defaultPath2 = '/uploads/users/user.jpg';
      if (user.image !== defaultPath1 && user.image !== defaultPath2) {
        unlinkImage(user.image);
      }
      user.image = `/uploads/users/${profileImage[0].filename}`
    }
    if (identityImage && identityImage.length > 0) {
      if (user.identityImage) {
        unlinkImage(user.identityImage);
      }
      user.identityImage = `/uploads/users/${identityImage[0].filename}`
    }
  }
  const updatedUser = await user.save();
  return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'user', message: req.t('user-updated'), data: updatedUser }));
})

const allsnappers = catchAsync(
  async (req, res) => {
    let filters = {
      role: 'snapper',
      adminApproval: 'Approved'
    };

    const options = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10
    }

    const search = req.query.search;
    if (search && search !== 'null' && search !== '' && search !== undefined) {
      const searchRegExp = new RegExp('.*' + search + '.*', 'i');
      filters = {
        ...filters,
        $or: [
          { fullName: { $regex: searchRegExp } },
          { email: { $regex: searchRegExp } },
          { phoneNumber: { $regex: searchRegExp } }
        ],
      };
    }
    const users = await getUsers(filters, options);
    return res.status(200).json(response({ statusCode: '200', message: req.t('users-list'), data: users, status: "OK" }));
  }
)

const allUsers = catchAsync(
  async (req, res) => {
    let filters = {};
    const options = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10
    }

    const role = req.query.role;
    if (role && role !== null && role !== 'null' && role !== '' && role !== undefined && role !== 'undefined') {
      filters.role = role;
    }

    const search = req.query.search;
    if (search && search !== 'null' && search !== '' && search !== undefined && search !== 'undefined') {
      const searchRegExp = new RegExp('.*' + search + '.*', 'i');
      filters = {
        ...filters,
        $or: [
          { fullName: { $regex: searchRegExp } },
          { email: { $regex: searchRegExp } },
          { phoneNumber: { $regex: searchRegExp } }
        ],
      };
    }

    const adminApproval = req.query.adminApproval;
    if (adminApproval && adminApproval !== 'null' && adminApproval !== '' && adminApproval !== undefined && adminApproval !== 'undefined') {
      filters.adminApproval = adminApproval;
    }
    const users = await getUsers(filters, options);
    return res.status(200).json(response({ statusCode: '200', message: req.t('users-list'), data: users, status: "OK" }));
  }
)

const snapperDetails = catchAsync(
  async (req, res) => {
    const snapper = await getUserById(req.params.id);
    const review = await getTopReviewOfsnapper(req.params.id);
    const portfolios = await getLimitedPortFolios(req.params.id, 4);
    return res.status(200).json(response({ statusCode: '200', message: req.t('snapper-details'), data: { snapper, review, portfolios }, status: "OK" }));
  }
)

const getUserRation = catchAsync(
  async (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const result = await getMonthlyUsersnapperRatio(year);
    return res.status(200).json(response({ statusCode: '200', message: req.t('user-snapper-ratio'), data: result, status: "OK" }));
  }
)

const updateUserByAdmin = catchAsync(async (req, res) => {
  if (req.body.userRole !== 'admin') {
    return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'user', message: req.t('unauthorised') }));
  }
  const updatedUser = await updateUser(req.params.id, req.body);
  return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'user', message: req.t('user-updated'), data: updatedUser }));
})

const deleteAccount = catchAsync(async (req, res) => {
  const user = await login(req.body.userEmail, req.body.password, 'deleteAccount');
  user.email = user.email + " (Account disabled), Joining Time: " + user.createdAt;
  user.fullName = "Dime User (Account disabled)"
  user.image = `/uploads/users/deletedAccount.jpg`
  await user.save();
  return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'user', message: req.t('user-updated'), data: user }));
})

const getNearestSnappers = catchAsync(async (req, res) => {
  if (req.body.userRole !== 'user') {
    return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'user', message: req.t('unauthorised') }));
  }
  const userDetails = await getUserById(req.body.userId);
  const result = await findNearestSnappers(req.body.userId, userDetails.location.coordinates, 10);
  return res.status(200).json(response({ statusCode: '200', message: req.t('snappers-list'), data: result, status: "OK" }));
})

module.exports = { signUp, signIn, validateEmail, forgetPassword, verifyForgetPasswordOTP, userDetails, resetPassword, changePassword, updateProfile, allsnappers, snapperDetails, getUserRation, allUsers, updateUserByAdmin, deleteAccount, getNearestSnappers }