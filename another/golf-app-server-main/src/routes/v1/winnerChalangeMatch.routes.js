const express = require("express");
const auth = require("../../middlewares/auth");
const {  winnerChalangeMatchController } = require("../../controllers");





const router = express.Router();

// get all show the toruemant   router 
//------------------------------------------------------------------------------------------
router.route('/')

.post(auth("common"),winnerChalangeMatchController.winnerChalangeMatchcreate)

router.route('/allUser')
.get(auth("common"),winnerChalangeMatchController.showAllUserforChalangeMatch)


module.exports = router;