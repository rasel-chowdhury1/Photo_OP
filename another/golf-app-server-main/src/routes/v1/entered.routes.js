const express = require("express");
const auth = require("../../middlewares/auth");
const { locationController, enteredController } = require("../../controllers");




const router = express.Router();

// entered show router 
//------------------------------------------------------------------------------------------

router.route('/')
.get(
    auth("common"),
    enteredController.showMyEntered
   
)
router.route('/details')
.get(
    auth("common"),
    enteredController.showTournaemntById
   
)




    




module.exports = router;