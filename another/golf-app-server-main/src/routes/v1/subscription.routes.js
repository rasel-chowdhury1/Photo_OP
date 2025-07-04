const express = require("express");
const auth = require("../../middlewares/auth");
const { subscriptionValidation } = require("../../validations");
const { subscriptionController } = require("../../controllers");
const validate = require("../../middlewares/validate");





const router = express.Router();

router.route('/')
.get(auth("admin"),subscriptionController.showAllSubscribeRequestedUser )


.post(
    auth("common"),
    validate(subscriptionValidation.subscriptionValidation),
    subscriptionController.createSubscription)

// show all block user
router.route('/cancled')
.get(auth("admin"),subscriptionController.showAllSubscribeUserBlock)
.put(auth("admin"),subscriptionController.canceledSubscriber)

// show all accept  user
router.route('/aproved')
.get(auth("admin"),subscriptionController.showAllSubscribeUser)
.put(auth("admin"),subscriptionController.acceptSubscribUser)



module.exports = router;