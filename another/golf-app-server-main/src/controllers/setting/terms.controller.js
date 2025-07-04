const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const { termsService } = require("../../services");
const response = require("../../config/response");


// Create terms
const createTerms = catchAsync(async (req, res) => {
  const terms = await termsService.createTerms(req.body);
  res.status(httpStatus.CREATED).json(terms);
});

// Get terms
const getTerms = catchAsync(async (req, res) => {
  const terms = await termsService.getTerms();
  res.status(httpStatus.OK).json(
    response({
      message: "terms show  ",
      status: "OK",
      statusCode: httpStatus.OK,
      data:terms,
    })
  )
});

// Update terms
const updateTerms = catchAsync(async (req, res) => {
  const terms = await termsService.updateTerms(req.params.termsId, req.body);
  res.status(httpStatus.OK).json(
    response({
      message: "terms updated  ",
      status: "OK",
      statusCode: httpStatus.OK,
      data:terms,
    })
  )
});

// Delete terms
const deleteTerms = catchAsync(async (req, res) => {
  await termsService.deleteTerms(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTerms,
  getTerms,
  updateTerms,
  deleteTerms,
};
