const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require('../../middlewares/validate');
const userFileUploadMiddleware=require('../../middlewares/fileUpload')


const convertHeicToPngMiddleware = require("../../middlewares/converter");
const { smallTournamentValidation } = require("../../validations");
const { smallTournamentController } = require("../../controllers");

const UPLOADS_FOLDER_USERS = "./public/uploads/tournament/big";

const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);



const router = express.Router();

// trurnament create router 
//------------------------------------------------------------------------------------------

router.route('/create')
.post(
    auth(),
    [uploadUsers.single("tournamentImage")],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),

    validate(smallTournamentValidation.smallTournamentValidation) ,
    smallTournamentController.createSmmallTournament )


    

 

 // trurnament get router 
//------------------------------------------------------------------------------------------
router.route('/getAll-small-tournament')
.get(
    auth(),
    smallTournamentController.getAllsmallTournament
)


   // for the admin 
//------------------------------------
router.route('/admin-controle')
.get(auth("admin"),smallTournamentController.showAllMySmallTournanmnetForRequest)

router.route('/admin-approved')
.get(auth("admin"),smallTournamentController.showallAprovedsmallTourmant)
.put(auth("admin"),smallTournamentController.showAllMySmallTournanmnetForRequestAproved)

router.route('/admin-cancled')
.get(auth("admin"),smallTournamentController.showallRejectsmallTourmant)
.put(auth("admin"),smallTournamentController.showAllMySmallTournanmnetForRequestRejected)






router.route('/makerequest-toplay')
.patch(auth("common"),smallTournamentController.makeRequiestToPlay)


 // trurnament get by id router 
//------------------------------------------------------------------------------------------
router.route('/:tournamentId')
.get(
    auth("common"),
    smallTournamentController.getSmallTournamentById
)

// make the toruemanet is update 
//---------------------------------------------
router.route("/make-tournament-complete")
.put(auth("common"),smallTournamentController.makeTournaemntIsComplite)
module.exports = router;