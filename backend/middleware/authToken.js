const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        const token = req.cookies?.token;

        console.log("Token:", token);

        if (!token) {
            return res.status(401).json({  // Changed to 401 for unauthorized access
                message: "Please Login...!",
                error: true,
                success: false
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log("Token verification error:", err);
                return res.status(403).json({  // 403 for forbidden due to invalid token
                    message: "Invalid token. Please log in again.",
                    error: true,
                    success: false
                });
            }

            req.userId = decoded?._id;
            next();
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || "An error occurred",
            data: [],
            error: true,
            success: false
        });
    }
}

module.exports = authToken;
