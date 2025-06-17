const Faq = require('./faq.model');

const addFaq = async (faqBody) => {
  let faq = await findFaq(faqBody);
  if (faq) {
    faq.question = faqBody.question;
    faq.answer = faqBody.answer;
  }
  else {
    faq = new Faq(faqBody);
  }
  await faq.save();
  return faq;
}

const findFaq = async (faqBody) => {
  const faq = await Faq.findOne({ question: faqBody.question, answer: faqBody.answer });
  return faq;
}

const getFaqs = async () => {
  return await Faq.find().select('question answer');
}

const deleteAFaq = async (faqId) => {
  return await Faq.findByIdAndDelete(faqId);
}

module.exports = {
  addFaq,
  getFaqs,
  deleteAFaq
}