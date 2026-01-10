const express = require('express');
const { getStaticPrivacyPolicyPage } = require('./privacyPolicy');
const { getStaticSupportPage } = require('./support');
const { getStaticAccountDeletePolicy } = require('./accountDeletePolicy');

const router = express.Router();

router.get("/privacy-policy", getStaticPrivacyPolicyPage);
router.get("/support", getStaticSupportPage);
router.get("/delete-account", getStaticAccountDeletePolicy);

module.exports = router;