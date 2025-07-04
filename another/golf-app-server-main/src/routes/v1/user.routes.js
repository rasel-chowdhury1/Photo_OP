const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const convertHeicToPngMiddleware = require("../../middlewares/converter");
const UPLOADS_FOLDER_USERS = "./public/uploads/users";

const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);

const router = express.Router();
router.route('/showgolfer')
  .get(auth("common"), userController.showAllGolfer)


router.route("/").get(auth("common"), userController.getUsers);
router.route('/profile').get( auth("common"),userController.myProfile)


router
  .route("/:userId")
  .get(auth("common"), userController.getUser)
  .patch(
    auth("common"),
    uploadUsers.fields([
      { name: 'image', maxCount: 1 },     // One file for the 'image' field
      { name: 'coverImage', maxCount: 1 } // One file for the 'coverImage' field
    ]),
   
    convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),
    userController.updateUser
  );
  router.route('/delete')
  .delete(auth("common"),)
  
module.exports = router;
