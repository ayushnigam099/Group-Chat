const jwt = require("jsonwebtoken");
const User = require("../models/users");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  const UserId=jwt.verify(token, process.env.TOKEN_SECRET)
  User.findByPk(UserId.id).then((result) => {
    req.user=result
    next()
  }).catch((err) => {
    console.log(err);
  });
}
module.exports = {
    authenticate
}