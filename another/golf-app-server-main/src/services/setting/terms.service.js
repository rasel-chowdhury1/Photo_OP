const { Terms } = require("../../models/setting.model");

// Create a new terms entry
const createTerms = async (data) => {
  return Terms.create(data);
};

// Get terms details
const getTerms = async () => {
  return Terms.findOne();
};

// Update terms details
const updateTerms = async (id, data) => {
  return Terms.findByIdAndUpdate(id, data, { new: true });
};

// Delete terms entry
const deleteTerms = async (id) => {
  return Terms.findByIdAndDelete(id);
};

module.exports = {
  createTerms,
  getTerms,
  updateTerms,
  deleteTerms,
};
