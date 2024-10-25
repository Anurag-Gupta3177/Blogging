const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];

        // If there's no cookie, proceed to the next middleware
        if (!tokenCookieValue) {
            return next();
        }

        try {
            // Validate the token and attach user data to the request object
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) {
            // Handle token validation errors, clear the invalid cookie
            console.error("Error validating token:", error);
            res.clearCookie(cookieName);  // Clear the invalid token cookie
        }

        // Proceed to the next middleware
        next();
    };
}

module.exports = {
    checkForAuthenticationCookie,
};
