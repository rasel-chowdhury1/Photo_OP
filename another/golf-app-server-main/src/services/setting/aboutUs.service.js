const { AboutUs } = require("../../models/setting.model");

// Create a new About Us entry
const createAboutUs = async (data) => {
  return AboutUs.create(data);
};

// Get About Us details
const getAboutUs = async () => {
  return AboutUs.findOne();
};

// Update About Us details
const updateAboutUs = async (id, data) => {
  return AboutUs.findByIdAndUpdate(id, data, { new: true });
};

// Delete About Us entry
const deleteAboutUs = async (id) => {
  return AboutUs.findByIdAndDelete(id);
};

module.exports = {
  createAboutUs,
  getAboutUs,
  updateAboutUs,
  deleteAboutUs,
};
