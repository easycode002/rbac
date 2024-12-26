const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];
  if (!token) {
    return res.status(403).json({
      success: false,
      msg: "A token is required for authentication!",
    });
  }

  try {
    // Split "Bearer <token>" and extract the actual token
    const bearer = token.split(" ");
    const bearerToken = bearer[1];

    // Verify the token
    const decodeData = jwt.verify(bearerToken, "secret_token_somethings");

    // Attach user data to the request object
    req.user = decodeData.user;
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Invalid token!!!",
    });
  }
  return next();
};

module.exports = verifyToken;
