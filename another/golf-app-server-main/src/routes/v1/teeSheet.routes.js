const express = require("express");
const auth = require("../../middlewares/auth");
const { teeSheetController } = require("../../controllers");





const router = express.Router();

// get all show the toruemant   router 
//------------------------------------------------------------------------------------------
router.route('/serchTournament')
.get(auth("common"),teeSheetController.showMyTournament)

// get all show the toruemant   router 
//------------------------------------------------------------------------------------------
router.route('/showTournamentById')
.get(auth("common"),teeSheetController.showTournamentById)


// get all show the toruemant   router 
//------------------------------------------------------------------------------------------
router.route('/')
.get(auth("common"),teeSheetController.showAllTeesheetByTournamentId)
.post(auth("common"),teeSheetController.createTeeSheet)



module.exports = router;