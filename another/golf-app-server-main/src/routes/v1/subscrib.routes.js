const express = require("express");
const auth = require("../../middlewares/auth");
const { subscribController } = require("../../controllers");



const router = express.Router();

router.route('/')
.get(subscribController.showSubscrib)
.put(auth("admin"),subscribController.updateSubcrib)
.post(auth("admin"),subscribController.createSubcrib)


module.exports = router;