const express = require("express");
const auth = require("../../middlewares/auth");
const { locationController } = require("../../controllers");




const router = express.Router();

// trurnament create router 
//------------------------------------------------------------------------------------------

router.route('/update')
.patch(
    auth(),
    locationController.updateUserLoaction
   
)


    




module.exports = router;