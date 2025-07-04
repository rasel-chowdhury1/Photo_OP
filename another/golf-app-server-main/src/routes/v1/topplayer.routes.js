const express = require("express");
const auth = require("../../middlewares/auth");
const {  invitationController, topplayerController } = require("../../controllers");




const router = express.Router();

// get all notifaction  router 
//------------------------------------------------------------------------------------------
router.route('/')
.get(auth("common"),topplayerController.topplayear)



module.exports = router;