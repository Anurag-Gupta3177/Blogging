const JWT = require("jsonwebtoken");
const secret = "myName";

function createToken(user) {
    //console.log("User object received in createToken:", user);

    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role
    };

    //console.log("Payload created for token:", payload);

    const token = JWT.sign(payload, secret);
    //console.log("Token created:", token);

    return token;
}

function validateToken(token) {
    const payload = JWT.verify(token, secret);
    // console.log("Decoded token payload:", payload);
    return payload;
}

module.exports = {
    createToken,
    validateToken,
};