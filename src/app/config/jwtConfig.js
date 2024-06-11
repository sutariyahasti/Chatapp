const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET || "hastisuatariya12344";
const generateToken = (id) => {
  const token = jwt.sign({ id }, secretKey, { expiresIn: "1h" });
  return token;
};

module.exports = generateToken;
