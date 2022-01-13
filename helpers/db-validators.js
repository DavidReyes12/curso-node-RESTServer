const Role = require("../models/role");
const User = require("../models/user");

const isValidRole =  async( role = "" ) => {
    const roleExist = await Role.findOne({ role });
    if ( !roleExist ) throw new Error(`${ role } is not in the DB`);
}

const emailAlreadyExist =  async( email = "" ) => {
    const emailExist = await User.findOne({ email });
    if ( emailExist ) throw new Error(`${ email } already exist`);
}

const existUserById =  async( id = "" ) => {
    const idExist = await User.findById( id );
    if ( !idExist ) throw new Error(`This ID does not exist ${ id }`);
}

module.exports = {
    isValidRole,
    emailAlreadyExist,
    existUserById
};
