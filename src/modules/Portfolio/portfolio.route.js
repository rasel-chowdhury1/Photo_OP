const express = require('express');
const { addNewPortfolios, editPortfolios, getAllPortfolios, deleteAPortfolio, getMyPortfolio, getSpecificPortfolios } = require('./portfolio.controller');
const router = express.Router();
const { isValidUser } = require('../../middlewares/auth')

const portfolioFileUploadMiddleware = require("../../middlewares/fileUpload");
const PORTFOLIO_FOLDER = "./public/uploads/portfolios";
const uploadPortfolio = portfolioFileUploadMiddleware(PORTFOLIO_FOLDER);
const convertHeicToPng = require('../../middlewares/converter');
const ensureUploadFolderExists = require('../../helpers/fileExists');

ensureUploadFolderExists(PORTFOLIO_FOLDER);

router.post('/', uploadPortfolio.fields([{ name: 'image', maxCount: 1 }]), convertHeicToPng(PORTFOLIO_FOLDER), isValidUser, addNewPortfolios);
router.put('/:id', uploadPortfolio.fields([{ name: 'image', maxCount: 1 }]), convertHeicToPng(PORTFOLIO_FOLDER),isValidUser, editPortfolios);
router.get('/my-portfolio', isValidUser, getMyPortfolio);
router.get('/:id', isValidUser, getSpecificPortfolios);
router.get('/', isValidUser, getAllPortfolios);
router.delete('/:id', isValidUser, deleteAPortfolio);

module.exports = router;