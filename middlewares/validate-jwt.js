const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateJWT = async( req = request, res = response, next ) => {
    
    const token = req.header("x-token");

    if ( !token ) return res.status(401).json({
        msg: "There's no token in the request"
    });

    try {

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        // find the user who made the request
        const user = await User.findById( uid );

        if ( !user ) return res.status(401).json({
            msg: "Invalid token - user is not in DB"
        });

        // Verify if the uid have state in true
        if ( !user.state ) return res.status(401).json({
            msg: "Invalid token - user with false state"
        });
        
        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: "Invalid token"
        });
    }

};

module.exports = {
    validateJWT
};
