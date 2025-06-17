const TermsAndCondition = require('./termsAndCondition.model');

const addTermsAndCondition = async (termsAndConditionBody) => {
  var termsAndCondition = await findTermsAndCondition();
  if (termsAndCondition) {
    termsAndCondition.content = termsAndConditionBody.content;
  }
  else {
    termsAndCondition = new TermsAndCondition(termsAndConditionBody);
  }
  await termsAndCondition.save();
  return termsAndCondition;
}

const findTermsAndCondition = async () => {
  const termsAndCondition = await TermsAndCondition.findOne();
  return termsAndCondition;
}

const getTermsAndCondition = async () => {
  return await TermsAndCondition.findOne().select('content');
}

module.exports = {
  addTermsAndCondition,
  getTermsAndCondition
}
