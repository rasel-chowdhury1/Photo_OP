const { Privacy } = require("../../models/setting.model");

// Create a new privacy entry
const createPrivacy = async (data) => {
  return Privacy.create(data);
};

// Get privacy details
const getPrivacy = async () => {
  return Privacy.findOne();
};

// Update privacy details
const updatePrivacy = async (id, data) => {
  return Privacy.findByIdAndUpdate(id, data, { new: true });
};

// Delete privacy entry
const deletePrivacy = async (id) => {
  return Privacy.findByIdAndDelete(id);
};

module.exports = {
  createPrivacy,
  getPrivacy,
  updatePrivacy,
  deletePrivacy,
};
