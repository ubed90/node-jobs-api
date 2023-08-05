const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors")

const authMiddleware = async (req, res, next) => {
    const { authorization: authHeader } = req.headers;

    if(!authHeader || !authHeader.startsWith("Bearer")) {
        throw new UnauthenticatedError('Not Authorized.');
    }

    const token = authHeader.split(" ")[1];

    try {
        const payLoad = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payLoad.userId, name: payLoad.name };

        // const user = await User.findById(payLoad.userId).select("-password");

        // req.user = user;

        next();
    } catch (error) {
        throw new UnauthenticatedError('Not Authorized.')
    }
}

module.exports = authMiddleware;