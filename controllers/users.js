const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");

const getUsers = async(req = request, res = response) => {

    // Query
    // const { q, nombre = "No name", apikey, page = 1, limit } = req.query;
    const { limit = 5, since = 0 } = req.query;
    const query = { state: true };

    /*const users = await User.find(query)
        .skip(Number(since))
        .limit(Number(limit));

    const total = await User.countDocuments(query);*/

    const [ total, users ] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(since))
            .limit(Number(limit))
    ]);

    res.json({
        /*msg: "get API - controller",
        q,
        nombre, 
        apikey,
        page,
        limit*/
        total,
        users
        // resp
    });
};

const postUsers = async(req, res = response) => {

    // Params
    // const { name, age } = req.body;
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    // if email already exist 
    /*const emailExist = await User.findOne({ email });
    if ( emailExist ) return res.status(400).json({
        msg: "Email already exist"
    });*/

    // password crypt
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    // save in DB
    await user.save();

    res.status(201).json({
        // msg: "post API - controller",
        // name,
        // age
        user
    });
};

const putUsers = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, email, ...rest } = req.body;

    // validate in DB
    if ( password ) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync( password, salt );
    }

    const userDB = await User.findByIdAndUpdate( id, rest );

    res.json({
        // msg: "put API - controller",
        userDB,
    });
};

const patchUsers = (req, res = response) => {
    res.json({
        msg: "patch API - controller",
    });
}

const deleteUsers = async(req, res = response) => {

    const { id } = req.params;

    // DELETE physically
    // const user = await User.findByIdAndDelete( id );

    const user = await User.findByIdAndUpdate( id, { state: false });
    //const allowUser = req.user; 

    //res.json({ user, allowUser });
    res.json(user);
}


module.exports = {
    getUsers,
    postUsers,
    putUsers,
    patchUsers,
    deleteUsers
};
