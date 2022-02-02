const { request, response } = require("express");
const { Category } = require("../models");

const createCategory = async( req = request, res = response ) => {

    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name });

    if ( categoryDB ) return res.status(400).json({
        msg: `Category ${ categoryDB.name } already exist`
    });

    // Generate data to save 
    const data = {
        name,
        user: req.user._id
    }

    const category = new Category( data );

    // Save in DB
    await category.save();

    res.status(201).json(category);

};

// getCategories - pagination - total - populate
const getCategories = async(req = request, res = response) => {

    // Query
    const { limit = 5, since = 0 } = req.query;
    const query = { state: true };

    const [ total, categories ] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .populate('user', 'name')
            .skip(Number( since ))
            .limit(Number( limit ))
    ]);

    res.json({
        total,
        categories
    });
};

// getCategory - populate {}
const getCategory = async(req = request, res = response) => {

    const { id } = req.params;

    const category = await Category.findById( id ).populate('user', 'name');

    res.json(category);
};

// updateCategory 
const updateCategory = async(req = request, res = response) => {

    const { id } = req.params;
    const { state, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate( id, data, { new: true });

    res.json(category);
};

// deleteCategory - estate:false
const deleteCategory = async(req = request, res = response) => {

    const { id } = req.params;

    const category = await Category.findByIdAndUpdate( id, { state: false }, { new: true });

    res.json(category);
}


module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
};
