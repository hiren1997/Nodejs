const jwt = require("jsonwebtoken");
const SECRET_JWT_CODE = process.env.SECRET_JWT_CODE

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization; // Corrected accessing headers
    if (!token) return res.status(401).json({ message: "Token is required" });

    jwt.verify(token, SECRET_JWT_CODE, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        req.user = decoded.user; // Attach the decoded user object to the request
        next();
    });
};

module.exports = {verifyToken};