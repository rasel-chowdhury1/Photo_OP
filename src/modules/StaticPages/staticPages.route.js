const express = require('express');
const { getStaticPrivacyPolicyPage } = require('./privacyPolicy');
const { getStaticSupportPage } = require('./support');

const router = express.Router();

router.get("/privacy-policy", getStaticPrivacyPolicyPage);
router.get("/support", getStaticSupportPage);

module.exports = router;