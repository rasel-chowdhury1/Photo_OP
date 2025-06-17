const AboutUs = require('./aboutUs.model');

const addAboutUs = async (aboutUsBody) => {
  var aboutUs = await findAboutUs();
  if (aboutUs) {
    aboutUs.content = aboutUsBody.content;
  }
  else {
    aboutUs = new AboutUs(aboutUsBody);
  }
  await aboutUs.save();
  return aboutUs;
}

const findAboutUs = async () => {
  const aboutUs = await AboutUs.findOne();
  return aboutUs;
}

const getAboutUs = async () => {
  return await AboutUs.findOne().select('content');
}

module.exports = {
  addAboutUs,
  getAboutUs
}
