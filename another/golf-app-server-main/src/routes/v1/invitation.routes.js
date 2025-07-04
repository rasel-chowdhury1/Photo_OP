const express = require("express");
const auth = require("../../middlewares/auth");
const {  invitationController } = require("../../controllers");




const router = express.Router();

// get all notifaction  router 
//------------------------------------------------------------------------------------------
router.route('/')
.get(auth("common"),invitationController.showAllMyInvation)
.post(auth("common"),invitationController.makeRequestToPlay)

router.route('/accept')
.put(auth("common"),invitationController.invationAccepted)
router.route('/delete')
.delete(auth("common"),invitationController.invationDelete)


module.exports = router;