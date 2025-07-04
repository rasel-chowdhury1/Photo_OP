const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require('../../middlewares/validate');

const userFileUploadMiddleware=require('../../middlewares/fileUpload')
const { tournamentValidation } = require("../../validations");
const { tournamentController } = require("../../controllers");
const convertHeicToPngMiddleware = require("../../middlewares/converter");
const UPLOADS_FOLDER_USERS = "./public/uploads/tournament/big";

const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);







const router = express.Router();

// trurnament create router 
//------------------------------------------------------------------------------------------

router.route('/create')
.post(
    auth("supperUser"),
    [uploadUsers.single("tournamentImage")],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),

    validate(tournamentValidation.tournamentValidation) ,
    tournamentController.createTournament )



 // trurnament get router 
//------------------------------------------------------------------------------------------
router.route('/getAll-tournament')
.get(
    auth("common"),
    tournamentController.getTournaments
)


   // for the admin 
//------------------------------------
router.route('/admin-controle')
.get(auth("admin"),tournamentController.showAllMyTournanmnetForRequest)

router.route('/admin-approved')
.get(auth("admin"),tournamentController.showallAprovedTourmant)
.put(auth("admin"),tournamentController.showAllTournanmnetForRequestAproved)

router.route('/admin-cancled')
.get(auth("admin"),tournamentController.showallRejectTourmant)
.put(auth("admin"),tournamentController.showAllMyTournanmnetForRequestRejected)





 // trurnament get by id router 
//------------------------------------------------------------------------------------------
router.route('/:tournamentId')
.get(
    auth("common"),
    tournamentController.getTournamentById
)


router.route('/makerequest-toplay')
.patch(auth("common"),tournamentController.makeRequiestToPlay)

module.exports = router;