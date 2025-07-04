const express = require("express");
const auth = require("../../middlewares/auth");
const {  winnerChalangeMatchController, winnerPlayerScoreController } = require("../../controllers");





const router = express.Router();

// get all show the toruemant   router 
//------------------------------------------------------------------------------------------
router.route('/')

.post(auth("common"),winnerPlayerScoreController.winnerplayerScoreCreate)

router.route('/allUser')
.get(auth("common"),winnerPlayerScoreController.showAllUserForplayerscore)


module.exports = router;