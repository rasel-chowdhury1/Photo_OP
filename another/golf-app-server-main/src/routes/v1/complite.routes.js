const express = require("express");
const auth = require("../../middlewares/auth");
const {  invitationController, chalengeMetcheController, compliteTournamentController } = require("../../controllers");




const router = express.Router();
// chalange router  router 
//------------------------------------------------------------------------------------------
router.route('/')
.get(auth("common"),compliteTournamentController.showAllCompliteTournament)




module.exports = router;