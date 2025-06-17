const express = require('express');
const { signUp, signIn, userDetails, forgetPassword, verifyForgetPasswordOTP, resetPassword, changePassword, updateProfile, validateEmail, allsnappers, snapperDetails, getUserRation, allUsers, deleteAccount, updateUserByAdmin, getNearestSnappers } = require('./user.controller');
const router = express.Router();
const userFileUploadMiddleware = require("../../middlewares/fileUpload");

const UPLOADS_FOLDER_USERS = "./public/uploads/users";
const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);

const { isValidUser, tokenCheck, noCheck } = require('../../middlewares/auth')
const validationMiddleware = require('../../middlewares/user/signupValidation');
const convertHeicToPng = require('../../middlewares/converter');
const ensureUploadFolderExists = require('../../helpers/fileExists');

ensureUploadFolderExists(UPLOADS_FOLDER_USERS);

//Sign-up user
router.post('/sign-up', validationMiddleware, signUp);
router.post('/sign-in', signIn);
router.post('/verify-email', tokenCheck, validateEmail);
router.post('/forget-password', forgetPassword);
router.post('/verify-otp', verifyForgetPasswordOTP);
router.post('/reset-password', resetPassword);

// snapper section
router.get('/snapper-details/:id', snapperDetails)
router.get('/snapper-list', allsnappers);
router.get('/nearest-snappers', isValidUser, getNearestSnappers);

router.get('/ratio', getUserRation);
router.get('/user-details', isValidUser, userDetails);
router.get('/', isValidUser, allUsers);
router.patch('/change-password', isValidUser, changePassword);
router.put('/:id', isValidUser, updateUserByAdmin);
router.put('/', uploadUsers.fields([
  { name: 'identityImage', maxCount: 1 },
  { name: 'profileImage', maxCount: 1 }
]), convertHeicToPng(UPLOADS_FOLDER_USERS), isValidUser, updateProfile);
router.delete('/', isValidUser, deleteAccount);

module.exports = router;