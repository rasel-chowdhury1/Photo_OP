const express = require("express");
const auth = require("../../middlewares/auth");
const { teeSheetController, winnerController, winnerSkinController } = require("../../controllers");





const router = express.Router();

// get all show the toruemant   router 
//------------------------------------------------------------------------------------------
router.route('/')

.put(auth("common"),winnerSkinController.updateWinnerSkin)
.post(auth("common"),winnerSkinController.winnerSkincreate)

router.route('/allUser')
.get(auth("common"),winnerSkinController.showAllUserForSkin)


module.exports = router;