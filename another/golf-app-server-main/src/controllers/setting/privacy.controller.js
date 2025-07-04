const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const { privacyService } = require("../../services");
const response = require("../../config/response");


// Create privacy
const createPrivacy = catchAsync(async (req, res) => {
  const privacy = await privacyService.createPrivacy(req.body);
  res.status(httpStatus.OK).json(
    response({
      message: "create privacy",
      status: "OK",
      statusCode: httpStatus.OK,
      data: privacy,
    })
  );
});

// Get privacy
const getPrivacy = catchAsync(async (req, res) => {
  const privacy = await privacyService.getPrivacy();
  res.status(httpStatus.OK).json(
    response({
      message: "show privacy",
      status: "OK",
      statusCode: httpStatus.OK,
      data: privacy,
    })
  );
});

// Update privacy
const updatePrivacy = catchAsync(async (req, res) => {

  const privacy = await privacyService.updatePrivacy(req.params.privacyId, req.body);
  res.status(httpStatus.OK).json(
    response({
      message: "updated privacy",
      status: "OK",
      statusCode: httpStatus.OK,
      data: privacy,
    })
  );});

// Delete privacy
const deletePrivacy = catchAsync(async (req, res) => {
  await privacyService.deletePrivacy(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPrivacy,
  getPrivacy,
  updatePrivacy,
  deletePrivacy,
};
