const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get Authorization header
  const authHeader = req.header("Authorization");

  // Check if header exists
  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Extract token (Bearer <token>)
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token format invalid" });
  }

  try {
    // Verify token using ENV secret
    const verified = jwt.verify(token, process.env.JWT_SECRET);
   

    // Attach user data to request
    req.user = verified;

    next(); // move to next middleware/route
  } catch (err) {
    console.error("JWT Error:", err.message);

    return res.status(401).json({ message: "Invalid or expired token" });
  }
};