const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
  const token = req.header('authorization').split(' ')[1]
  
  if (!token) {
    return res.status(422).send({ Error: "Token not found" });
  }
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
        return res.status(422).send({'Error':'Invalid Token'});
    }
    req.user = decoded;

    next();
  } catch (e) {
    return res.status(500).send({ Error: e });
  }
}

module.exports = auth;
