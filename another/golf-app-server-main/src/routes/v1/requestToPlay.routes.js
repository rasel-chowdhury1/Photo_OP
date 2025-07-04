const express = require("express");
const auth = require("../../middlewares/auth");
const { requestToPlayController } = require("../../controllers");





const router = express.Router();

// get all notifaction  router 
//------------------------------------------------------------------------------------------
router.route('/')
.get(auth("common"),requestToPlayController.showAllrequestedtournament)
.patch(auth("common"),requestToPlayController.aprovedTheRequest)
.post(auth("common"),requestToPlayController.makeRequestToplay)

// get all notifaction  router by id 
//------------------------------------------------------------------------------------------
router.route('/:id')
.get(auth("common"),requestToPlayController.showAllRequiestedTouranamentById)

// cancel the 
//-------------------------------------
router.route('/cancleRequest')
.patch(auth("common"),requestToPlayController.cancelRequest)



module.exports = router;