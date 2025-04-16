const jwt = require("jsonwebtoken");

const excludedRoutes = ["/api/auth/login", "/api/auth/register"];

const verifyToken = (req, res, next) => {
    // Skip token check for excluded routes
    if (excludedRoutes.includes(req.originalUrl)) {
        return next();
    }

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied. Token missing." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // You can access `req.user.user_id` in controllers
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid Token." });
    }
};

module.exports = verifyToken;
