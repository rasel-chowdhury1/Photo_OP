const express = require("express");
const auth = require("../../middlewares/auth");
const { teeSheetController, winnerController, winnerSkinController, winnerKpsController } = require("../../controllers");





const router = express.Router();

// get all show the toruemant   router 
//------------------------------------------------------------------------------------------
router.route('/')

.post(auth("common"),winnerKpsController.winnerKpscreate)

router.route('/allUser')
.get(auth("common"),winnerKpsController.showAllUserForKps)


module.exports = router;