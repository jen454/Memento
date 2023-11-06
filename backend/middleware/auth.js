const User = require("../models/User");

let auth = (req, res, next) => {
  let token = req.headers.x_auth;
  console.log("token", token);

  User.findByToken(token)
    .then((user) => {
      console.log(user);
      if (!user) return res.json({ isAuth: false, error: true });
      req.token = token;
      req.user = user;
      next();
    })
    .catch((err) => {
      throw err;
    });
};

module.exports = { auth };
