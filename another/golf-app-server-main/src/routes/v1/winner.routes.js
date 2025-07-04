const express = require("express");
const auth = require("../../middlewares/auth");
const { teeSheetController, winnerController } = require("../../controllers");





const router = express.Router();

// get all show the toruemant   router 
//------------------------------------------------------------------------------------------
router.route('/')
.get(auth("common"),winnerController.showAllWinnerResultForTournament)
.put(auth("common"),winnerController.updateTournamentForShowPalyer)
// .post(auth("common"),winnerController.createWinner)



module.exports = router;