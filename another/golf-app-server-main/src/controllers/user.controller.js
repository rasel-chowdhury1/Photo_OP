const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { userService } = require("../services");
const unlinkImages = require("../common/unlinkImage");

const pagination = require("../utils/pagination");

// create  user controller 
//---------------------------------------------------------------------------
// ############################################################

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "User Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: user,
    })
  );
});

// get all  user controller 
//---------------------------------------------------------------------------
// ############################################################

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role", "gender"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await userService.queryUsers(filter, options);
  res.status(httpStatus.OK).json(
    response({
      message: "All Users",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

// get  user controller 
//---------------------------------------------------------------------------
// ############################################################

const getUser = catchAsync(async (req, res) => {
  let user = await userService.getUserById(req.params.userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  res.status(httpStatus.OK).json(
    response({
      message: "User",
      status: "OK",
      statusCode: httpStatus.OK,
      data: user,
    })
  );
});

// update user controller 
//---------------------------------------------------------------------------
// ############################################################

// const updateUser = catchAsync(async (req, res) => {
//   // if (req.body) {
//   //   const parsedInterest = JSON.parse(req.body);
//   //   req.body.interest = parsedInterest;
//   // }
//   // Handle file uploads for images
//   const image = req.files?.image;
//   const coverImage = req.files?.coverImage;

//   console.log(req.files);
//   if (req.files) {
//     image.url = "/uploads/users/" + req.files.filename;
//     image.path = req.files.path;
//   }
//   if (req.files) {
//     req.body.image = image;
//   }
//   console.log(req.files);
//   if (req.files) {
//     coverImage.url = "/uploads/users/" + req.files.filename;
//     coverImage.path = req.files.path;
//   }
//   if (req.files) {
//     req.body.coverImage = coverImage;
//   }
//   const carImagefiles = carImage
//   ? carImage.map((img) => ({
//         publicFileUrl: `/images/users/${img.filename}`,
//         path: img.filename,
//     }))
//   : [];

// const carRegistationfiles = carRegistation
//   ? carRegistation.map((img) => ({
//         publicFileUrl: `/images/users/${img.filename}`,
//         path: img.filename,
//     }))
//   : [];

//   const user = await userService.updateUserById(req.params.userId, req.body);

//   res.status(httpStatus.OK).json(
//     response({
//       message: "User Updated",
//       status: "OK",
//       statusCode: httpStatus.OK,
//       data: user,
//     })
//   );
// });

const updateUser = catchAsync(async (req, res) => {

  const image = req.files?.image ? req.files.image[0] : null;
  const coverImage = req.files?.coverImage ? req.files.coverImage[0] : null;

  

  // Processing image file if available
  if (image) {
    image.url = "/uploads/users/" + image.filename; // URL for the image
    image.path = image.path; // Path for the image (from multer)
    req.body.image = {"url":image.url,"path":image.path};  // Attach image data to req.body
  }

  // Processing coverImage file if available
  if (coverImage) {
    coverImage.url = "/uploads/users/" + coverImage.filename; // URL for the cover image
    coverImage.path = coverImage.path; // Path for the cover image (from multer)
    req.body.coverImage = {"url":coverImage.url,"path":coverImage.path}; // Attach coverImage data to req.body
  }


  // Perform the user update
  const user = await userService.updateUserById(req.params.userId, req.body);

  // Return the success response
  res.status(httpStatus.OK).json(
    response({
      message: "User Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: user,
    })
  );
});

// delete user controller 
//---------------------------------------------------------------------------
// ############################################################

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.query.userId);
  res.status(httpStatus.OK).json(
    response({
      message: "User Deleted",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

// my profile  controller 
//---------------------------------------------------------------------------
// ############################################################

const myProfile=catchAsync(async(req,res)=>{
  const id=req.user._id

  const profile=await userService.getUserById(id)
 
  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.status(httpStatus.OK).json(
    response({
      message:"show Profile",
      status:"OK",
      statusCode:httpStatus.OK,
      data:{"user":profile}
    })
  )

})

// show all golfer contorller 
//---------------------------------------
// const showAllGolfer=catchAsync(async(req,res)=>{
 
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;


//  const {golfers,totalGolferCount}=await userService.showAllGolfer()
//   // Generate pagination data
// const toruanmentPaginate = pagination(totalGolferCount, limit, page);
// console.log(golfers,toruanmentPaginate);
 
//   res.status(httpStatus.OK).json(
//     response({
//       message:"show Profile",
//       status:"OK",
//       statusCode:httpStatus.OK,
//       data:golfers,
//       pagination:toruanmentPaginate
//     })
//   )

// })

const showAllGolfer = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const userId=req.user._id


  // Get the name from query params (if present)
  const nameFilter = req.query.name || '';

  // Pass the name filter to the userService.showAllGolfer method
  const { golfers, totalGolferCount } = await userService.showAllGolfer(nameFilter,userId);

  // Generate pagination data
  const tournamentPaginate = pagination(totalGolferCount, limit, page);

  console.log(golfers, tournamentPaginate);

  res.status(httpStatus.OK).json(
    response({
      message: 'show Profile',
      status: 'OK',
      statusCode: httpStatus.OK,
      data: golfers,
      pagination: tournamentPaginate
    })
  );
});


module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  myProfile,
  showAllGolfer
};
