require("dotenv").config();
const jwt = require("jsonwebtoken");
const verifyToken = async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(403).json({ error: "Authorization Token Is Missing" });
  } else {
    try {
      const decoded = await jwt.verify(token, process.env.SECRET_KEY);
      req.info = decoded;
    } catch (error) {
      res.status(401).json({ error: "Unauthorized" });
    }
  }
};

const isAdmin = async (req, res, next) => {
  await verifyToken(req, res);
  if (!req?.info?.docData?.isAdmin) {
    res.status(401).json({ message: "FORBIDDEN" });
  }
  next();
};
module.exports = { isAdmin };
