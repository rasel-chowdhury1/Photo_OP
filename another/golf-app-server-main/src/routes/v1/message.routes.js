const express = require("express");
const auth = require("../../middlewares/auth");
const {  invitationController, lookingtoPlayController, messageController } = require("../../controllers");




const router = express.Router();

// get all notifaction  router 
//------------------------------------------------------------------------------------------
router.route('/')
.get(auth("common"),messageController.showMyChatMessage)


module.exports = router;