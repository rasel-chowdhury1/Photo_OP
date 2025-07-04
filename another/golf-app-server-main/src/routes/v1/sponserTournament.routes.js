const express = require("express");
const auth = require("../../middlewares/auth");
const { sponserTournamentController } = require("../../controllers");
const convertHeicToPngMiddleware = require("../../middlewares/converter");

const userFileUploadMiddleware=require('../../middlewares/fileUpload')
const UPLOADS_FOLDER_USERS = "./public/uploads/tournament/big";

const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);




const router = express.Router();


// create sponser tournament 
//--------------------------------------------------------

router.route("/")
.get(auth("common"),sponserTournamentController.showAllsponserTournament)

.patch(auth("supperUser"),
[uploadUsers.single("sponserImage")],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),
sponserTournamentController.updateSponserTournament)
  
.post(auth("supperUser"),
[uploadUsers.single("sponserImage")],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),
sponserTournamentController.createSponserTournament)

  




module.exports = router;