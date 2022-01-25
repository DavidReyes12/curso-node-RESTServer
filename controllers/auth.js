const { response, request, json } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");

const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async(req = request, res = response) => {

    const { email, password } = req.body;

    try {

        // Verify if the email exist
        const user = await User.findOne({ email });
        if ( !user ) return res.status(400).json({
            msg: "User / Password are not correct - email"
        });

        // user exist?
        if ( !user.state ) return res.status(400).json({
            msg: "User / Password are not correct - state: false"
        });

        // Verify password
        const validPassword = bcryptjs.compareSync( password, user.password );
        if ( !validPassword ) return res.status(400).json({
            msg: "User / Password are not correct - password"
        });

        // Generate JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "You need to talk with the administrator"
        });
    }

}

const googleSignIn = async( req = request, res= response ) => {
    
    const { id_token } = req.body;

    try {

        const { name, picture, email } = await googleVerify( id_token );

        let user = await User.findOne({ email });

        if ( !user ) {

            // Create new User
            const data = {
                name,
                email,
                password: ":P",
                picture,
                google: true
            };

            user = new User( data );
            await user.save();
        }

        // If User in DB exist "state: true"
        if ( !user.state ) return res.status(401).json({
            msg: "Talk with the administrator, user blocked"
        });

        // Generate JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });
        
    } catch (error) {
        res.status(400).json({
            msg: "Token can not be verified"
        });
    }

}



module.exports = {
    login,
    googleSignIn
};
