const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const { aboutUsService } = require("../../services");
const response = require("../../config/response");


// Create About Us
const createAboutUs = catchAsync(async (req, res) => {
  const aboutUs = await aboutUsService.createAboutUs(req.body);
  res.status(httpStatus.CREATED).json(aboutUs);
});

// Get About Us
const getAboutUs = catchAsync(async (req, res) => {
  const aboutUs = await aboutUsService.getAboutUs();
  res.status(httpStatus.OK).json(
    response({
      message: "show the about us",
      status: "OK",
      statusCode: httpStatus.OK,
      data: aboutUs,
    })
  );
});

// Update About Us
const updateAboutUs = catchAsync(async (req, res) => {
  const aboutUs = await aboutUsService.updateAboutUs(req.params.aboutId, req.body);
  res.status(httpStatus.OK).json(
    response({
      message: "about use ",
      status: "OK",
      statusCode: httpStatus.OK,
      data: aboutUs
    })
  )

});

// Delete About Us
const deleteAboutUs = catchAsync(async (req, res) => {
  await aboutUsService.deleteAboutUs(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAboutUs,
  getAboutUs,
  updateAboutUs,
  deleteAboutUs,
};
