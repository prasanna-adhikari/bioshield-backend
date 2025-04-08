const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 🔥 This is where the token is decoded + verified
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ⬇️ Attach decoded data to the request so controllers can use it
    req.user = decoded;

    next(); // allow access to the route
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
