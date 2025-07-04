const express = require("express");
const auth = require("../../middlewares/auth");
const {  invitationController, lookingtoPlayController } = require("../../controllers");




const router = express.Router();

// get all notifaction  router 
//------------------------------------------------------------------------------------------
router.route('/')
.get(auth("common"),lookingtoPlayController.showAllLookingToPlay)
.post(auth("common"),lookingtoPlayController.lookingToPlayCreate)

router.route('/show-tournament')
.get(auth("common"),lookingtoPlayController.showAllTournament)


module.exports = router;