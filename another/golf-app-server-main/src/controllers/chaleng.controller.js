const httpStatus = require("http-status");
const { chalangeMatchService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");


// Create a new challenge match
const createChalangeMatch = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const data = req.body;

    const result = await chalangeMatchService.createChalangeMatch(data, userId);

    res.status(httpStatus.CREATED).json(
        response({
            message: "Challenge match created successfully",
            status: "Created",
            statusCode: httpStatus.CREATED,
            data: result,
        })
    );
});

// Get all challenge matches where the user is a participant
const showAllMyChalangeMatches = catchAsync(async (req, res) => {
    const userId = req.user._id;
   
    const {id,type}=req.query

    const result = await chalangeMatchService.showAllMyChalangeMatches(userId,id,type);

    res.status(httpStatus.OK).json(
        response({
            message: "Challenge matches retrieved successfully",
            status: "OK",
            statusCode: httpStatus.OK,
            data: result,
        })
    );
});

// Get a single challenge match by ID
const getChalangeMatchById = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await chalangeMatchService.getChalangeMatchById(id);

    res.status(httpStatus.OK).json(
        response({
            message: "Challenge match retrieved successfully",
            status: "OK",
            statusCode: httpStatus.OK,
            data: result,
        })
    );
});

// Update a challenge match by ID
const updateChalangeMatch = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const result = await chalangeMatchService.updateChalangeMatch(id, updateData);

    res.status(httpStatus.OK).json(
        response({
            message: "Challenge match updated successfully",
            status: "OK",
            statusCode: httpStatus.OK,
            data: result,
        })
    );
});

// Delete a challenge match by ID
const deleteChalangeMatch = catchAsync(async (req, res) => {
    const { id } = req.query;

    await chalangeMatchService.deleteChalangeMatch(id);

    res.status(httpStatus.OK).json(
        response({
            message: "Challenge match deleted successfully",
            status: "OK",
            statusCode: httpStatus.OK,
        })
    );
});

// show all the player
//-------------------------------------
const showAllThePlayer = catchAsync(async (req, res) => {
   
    const userId=req.user._id
    const data=req.query
    const result = await chalangeMatchService.showAllThePlayer(userId,data);

    res.status(httpStatus.OK).json(
        response({
            message: "shoa all layer fo the metch ",
            status: "OK",
            statusCode: httpStatus.OK,
            data: result,
        })
    );
});

module.exports = {
    createChalangeMatch,
    showAllMyChalangeMatches,
    getChalangeMatchById,
    updateChalangeMatch,
    deleteChalangeMatch,
    showAllThePlayer
};
