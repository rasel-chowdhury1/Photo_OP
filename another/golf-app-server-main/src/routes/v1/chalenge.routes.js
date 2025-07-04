const express = require("express");
const auth = require("../../middlewares/auth");
const {  invitationController, chalengeMetcheController } = require("../../controllers");




const router = express.Router();
// chalange router  router 
//------------------------------------------------------------------------------------------
router.route('/')
.get(auth("common"),chalengeMetcheController.showAllMyChalangeMatches)
.post(auth("common"),chalengeMetcheController.createChalangeMatch)
.delete(auth("common"),chalengeMetcheController.deleteChalangeMatch)

router.route('/showAllplayer')
.get(auth("common"),chalengeMetcheController.showAllThePlayer)



module.exports = router;