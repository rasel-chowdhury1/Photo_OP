const catchAsync = require('../../helpers/catchAsync');
const sendNotification = require('../../helpers/formatNotification');
const response = require("../../helpers/response");
const unlinkImage = require('../../helpers/unlinkImage');
const { addPortfolio, getPortfolios, deletePortfolio, getPortfolioById } = require('./portfolio.service');

const addNewPortfolios = catchAsync(async (req, res) => {
  if (req.files) {
    const { image } = req.files;
    if (image && image.length > 0) {
      req.body.image = `/uploads/portfolios/${image[0].filename}`
    }
  }
  req.body.user = req.body.userId;
  const portfolioStatus = await addPortfolio(req.body);
  return res.status(201).json(response({ status: 'OK', statusCode: '201', type: 'portfolio', message: req.t('portfolio-added'), data: portfolioStatus }));
});

const editPortfolios = catchAsync(async (req, res) => {
  const existingPortfilio = await getPortfolioById(req.params.id);
  if (req.files) {
    const { image } = req.files;
    if (image && image.length > 0) {
      if(existingPortfilio.image){
        unlinkImage(existingPortfilio.image);
      }
      req.body.image = `/uploads/users/${image[0].filename}`
    }
  }
  Object.assign(existingPortfilio, req.body);
  const updatedPortfolio = await existingPortfilio.save();
  return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'portfolio', message: req.t('portfolio-updated'), data: updatedPortfolio }));
})

const getSpecificPortfolios = catchAsync(async (req, res) => {
  const options = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10
  }
  let filter = {
    user : req.params.id
  };
  const category = req.query.category;
  if (category && category !== null && category !== undefined && category !== '' && category !== 'null' && category !== 'undefined') {
    filter.category = category;
  }
  const portfolios = await getPortfolios(filter, options);
  return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'portfolio', message: req.t('portfolio-list'), data: portfolios }));
})

const getAllPortfolios = catchAsync(async (req, res) => {
  let filter = {};
  const options = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10
  }
  const category = req.query.category;
  if (category && category !== null && category !== undefined && category !== '' && category !== 'null' && category !== 'undefined') {
    filter.category = category;
  }
  const portfolios = await getPortfolios(filter, options);
  return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'portfolio', message: req.t('portfolio-list'), data: portfolios }));
})

const getMyPortfolio = catchAsync(async (req, res) => {
  const options = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10
  }
  let filter = {
    user: req.body.userId
  };

  const category = req.query.category;
  if (category && category !== null && category !== undefined && category !== '' && category !== 'null' && category !== 'undefined') {
    filter.category = category;
  }
  const portfolios = await getPortfolios(filter, options);
  return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'portfolio', message: req.t('portfolio-list'), data: portfolios }));
})

const deleteAPortfolio = catchAsync(async (req, res) => {
  const deletedPortfolio = await deletePortfolio(req.params.id);
  if(deletedPortfolio && deletedPortfolio.image){
    unlinkImage(deletedPortfolio.image);
  }
  return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'portfolio', message: req.t('portfolio-deleted'), data: deletedPortfolio }));
})

module.exports = { addNewPortfolios, editPortfolios, getAllPortfolios, deleteAPortfolio, getMyPortfolio, getSpecificPortfolios }