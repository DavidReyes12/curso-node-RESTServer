const { request, response } = require("express");

const isAdmin = ( req = request, res = response, next ) => {
  
    if ( !req.user ) return res.status(500).json({
        msg: "Is necesary verify the token before the role"
    });

    const { role, name } = req.user;

    if ( role !== "ADMIN_ROLE" ) return res.status(401).json({
        msg: `${name} is not administrator`
    })

    next();
};

const haveRole = ( ...roles ) => {
    
    return (req = request, res = response, next) => {

        if ( !req.user ) return res.status(500).json({
            msg: "Is necesary verify the token before the role"
        });

        if ( !roles.includes( req.user.role ) ) return res.status(401).json({
            msg: `This service require one of this roles ${roles}`
        });

        next();
    }
}


module.exports = {
    isAdmin,
    haveRole
};
