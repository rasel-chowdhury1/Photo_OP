const User = require("../../modules/User/user.model");
const response = require("../../helpers/response");
const logger = require("../../helpers/logger");
const catchAsync = require("../../helpers/catchAsync");

function validateEmail(email) {
  return /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9._%+-]+@[a-zA-ZÀ-ÖØ-öø-ÿ0-9.-]+\.[a-zA-ZÀ-ÖØ-öø-ÿ]{2,}$/.test(
    email
  );
}

const validationMiddleware = catchAsync(async (req, res, next) => {

  const { fullName, password, email, phoneNumber } =
    req.body;
  let errors = [];

  const user = await User.findOne({ email });
  if (user) {
    return res
      .status(409)
      .json(
        response({
          status: "Error",
          statusCode: "409",
          type: "sign-up",
          message: req.t("email-exists"),
        })
      );
  }

  if (!fullName) {
    errors.push({ field: "fullName", message: req.t("name-required") });
  }

  if (!validateEmail(email)) {
    errors.push({ field: "email", message: req.t("email-format-error") });
  }

  if (!password) {
    errors.push({ field: "password", message: req.t("password-format-error") });
  }

  if (!phoneNumber) {
    errors.push({
      field: "phoneNumber",
      message: req.t("phone-number-required"),
    });
  }

  if (Object.keys(errors).length !== 0) {
    logger.error("Sign up validation error", "sign-up middleware");
    if (req.file) {
      unlinkImage(req.file.path);
    }
    return res
      .status(422)
      .json(
        response({
          status: "Error",
          statusCode: "422",
          type: "sign-up",
          message: req.t("validation-error"),
          errors: errors,
        })
      );
  }
  next();
});

module.exports = validationMiddleware;
