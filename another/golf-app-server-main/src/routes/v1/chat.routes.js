const express = require("express");
const auth = require("../../middlewares/auth");
const {  chatController } = require("../../controllers");




const router = express.Router();
// chat  router   
//------------------------------------------------------------------------------------------
router.route('/')
.get(auth("common"),chatController.showMyCaht)
// chat  router   
//------------------------------------------------------------------------------------------
router.route('/single')
.post(auth("common"),chatController.createsingleChat)

// chat  router   group
//------------------------------------------------------------------------------------------
router.route('/group')
.post(auth("common"),chatController.createGroupChat)



module.exports = router;