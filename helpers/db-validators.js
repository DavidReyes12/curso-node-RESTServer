const { Category, User, Role, Product } = require("../models");

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

// Categories

const existCategoryById =  async( id = "" ) => {
    const idExist = await Category.findById( id );
    if ( !idExist ) throw new Error(`This ID does not exist ${ id }`);
}

// Products

const existProductById =  async( id = "" ) => {
    const idExist = await Product.findById( id );
    if ( !idExist ) throw new Error(`This ID does not exist ${ id }`);
}

module.exports = {
    isValidRole,
    emailAlreadyExist,
    existUserById,
    existCategoryById,
    existProductById,
};
