const express = require("express");
const auth = require("../../middlewares/auth");
const { notifactionController } = require("../../controllers");




const router = express.Router();

// get all notifaction  router 
//------------------------------------------------------------------------------------------
router.route('/')
.get(auth("common"),notifactionController.getAllNotifaction)
.patch(auth("common"),notifactionController.markAsRead)

module.exports = router;