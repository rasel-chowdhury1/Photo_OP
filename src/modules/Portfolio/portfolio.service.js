const Portfolio = require('./portfolio.model');

const addPortfolio = async (portfolioBody) => {
  const newWithdrawReq = new Portfolio(portfolioBody);
  return await newWithdrawReq.save();
}

const deletePortfolio = async (portfolioId) => {
  return await Portfolio.findByIdAndDelete(portfolioId);
}

const getPortfolioById = async (portfolioId) => {
  return await Portfolio.findById(portfolioId);
}

const getPortfolios = async (filter, options) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;
  const portfolios = await Portfolio.find(filter).skip(skip).limit(limit).populate('user', 'fullName image');
  const totalResults = await Portfolio.countDocuments(filter);
  const totalPages = Math.ceil(totalResults / limit);
  const pagination = { currentPage: page, limit, totalResults, totalPages };
  return { portfolios, pagination };
}

// Get limited portfolios for snapper details
const getLimitedPortFolios = async (userId, limit) => {
  return await Portfolio.find({user: userId}).limit(limit);
}

module.exports = {
  addPortfolio,
  getPortfolioById,
  getPortfolios,
  deletePortfolio,
  getLimitedPortFolios
}
