const PrivacyPolicy = require('./privacyPolicy.model');

const addPrivacyPolicy = async (privacyPolicyBody) => {
  var privacyPolicy = await findPrivacyPolicy();
  if (privacyPolicy) {
    privacyPolicy.content = privacyPolicyBody.content;
  }
  else {
    privacyPolicy = new PrivacyPolicy(privacyPolicyBody);
  }
  await privacyPolicy.save();
  return privacyPolicy;
}

const findPrivacyPolicy = async () => {
  const privacyPolicy = await PrivacyPolicy.findOne();
  return privacyPolicy;
}

const getPrivacyPolicy = async () => {
  return await PrivacyPolicy.findOne().select('content');
}

module.exports = {
  addPrivacyPolicy,
  getPrivacyPolicy
}
