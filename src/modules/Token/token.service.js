const Token = require('./token.model');

const addToken = async (tokenBody) => {
  var token = await verifyToken(tokenBody.token);
  if (token) {
    token.passcodeToken = tokenBody.token;
  }
  else {
    token = new Token({
      passcodeToken: tokenBody.token,
      userId: tokenBody.userId,
      purpose: tokenBody.purpose
    });
  }
  const data = await token.save();
  setTimeout(async () => {
    await deleteToken(data._id);
  }, 180000);//delete token after 3 minutes
  return token;
}

const verifyToken = async (token, purpose) => {
  const tokenObj = await Token.findOne({ passcodeToken: token, purpose: purpose }).populate('userId');
  if (tokenObj) {
    return tokenObj;
  }
  else {
    return null;
  }
}

const deleteToken = async (tokenId) => {
  return await Token.findByIdAndDelete(tokenId);
}

module.exports = {
  addToken,
  verifyToken,
  deleteToken
}