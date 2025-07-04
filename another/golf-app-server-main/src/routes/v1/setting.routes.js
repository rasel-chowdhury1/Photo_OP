const express = require("express");
const auth = require("../../middlewares/auth");


const { privacy, terms, aboutUs } = require("../../controllers");




const router = express.Router();




// setting route for the privacy 
//-------------------------------------------------------------------------

router.route("/privacy").get(auth("common"), privacy.getPrivacy); 

router
  .route("/privacy/:privacyId")

  .patch(
    auth("admin"),

    privacy.updatePrivacy
  );
  
// setting route for the terms
//--------------------------------------------------------------------------
router.route("/terms").get(auth("common"),terms.getTerms)
router
  .route("/terms/:termsId")

  .patch(
    auth("admin"),

    terms.updateTerms
  );

// setting route for the terms
//------------------------------------------------------------------------------
router.route("/about-us").get(auth("common"),aboutUs.getAboutUs)
router
  .route("/about-us/:aboutId")

  .patch(
    auth("admin"),

   aboutUs.updateAboutUs
  );

module.exports = router;
