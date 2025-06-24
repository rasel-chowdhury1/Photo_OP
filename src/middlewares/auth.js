const jwt = require('jsonwebtoken');
const response = require("../helpers/response");
const catchAsync = require('../helpers/catchAsync');

const isValidUser = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;
  let decodedData;
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
    if (token && token !== undefined && token !== null && token !== "null") {
      decodedData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    }
  }
  if (!authorization || !decodedData) {
    return res.status(401).json(response({ status: 'Unauthorised', statusCode: '401', type: 'auth', message: req.t('unauthorised') }));
  }
  req.body.userId = decodedData._id;
  req.body.userRole = decodedData.role;
  req.body.userEmail = decodedData.email;
  req.body.userFullName = decodedData.userFullName;
  next();
});

const tokenCheck = catchAsync(
  async (req, res, next) => {
    const { signuptoken } = req.headers;
    if (signuptoken && signuptoken.startsWith("signUpToken ")) {
      const token = signuptoken.split(" ")[1];
      console.log({token})
      let decodedData = {};
      if (token && token !== undefined && token !== null && token !== "null") {
        decodedData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
      }

      console.log({decodedData})
      req.body.userData = decodedData;
    }
    next();
  }
);

const noCheck = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    let token;
    let decodedData;
    if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];
      if (token) {
        decodedData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
        if (decodedData) {
          req.body.userId = decodedData._id;
          req.body.userRole = decodedData.role;
          req.body.userEmail = decodedData.email;
          req.body.userFullName = decodedData.userFullName;
        }
      }
    }
    next();
  }
  catch (err) {
    console.log(err, '----------------------------error-------------------------');
    next();
  }
}


module.exports = { isValidUser, tokenCheck, noCheck };