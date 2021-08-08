const User = require("../models/User");

const auth_old = async (req, res, next) => {
  const token = req.get("token");
  if (!token) {
    res.status(401).send({ error: "No token presented" })
  } else {
    const user = await User.findOne({ token });
    if (!user) {
      res.status(401).send({ error: "Wrong token: unauthorized" });
    } else {
      req.user = user;
      next();
    }
  }
}

module.exports = auth_old;