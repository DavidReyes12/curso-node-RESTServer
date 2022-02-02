const { request, response } = require("express");
const { Product, Category } = require("../models");

const createProduct = async( req = request, res = response ) => {

    const { state, user, ...body } = req.body;

    const productDB = await Product.findOne({ name: body.name });

    if ( productDB ) return res.status(400).json({
        msg: `Product ${ productDB.name } already exist`
    });

    // Generate data to save 
    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id,
    }

    const product = new Product( data );

    // Save in DB
    await product.save();

    res.status(201).json(product);

};

// getProducts - pagination - total - populate
const getProducts = async( req = request, res = response ) => {

    // Query
    const { limit = 5, since = 0 } = req.query;
    const query = { state: true };

    const [ total, products ] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('user', 'name')
            .populate('category', 'name')
            .skip(Number( since ))
            .limit(Number( limit ))
    ]);

    res.json({
        total,
        products
    });
};

// getProduct - populate {}
const getProduct = async( req = request, res = response ) => {

    const { id } = req.params;

    const product = await Product.findById( id )
                            .populate('user', 'name')
                            .populate('category', 'name');

    res.json(product);
};

// updateProduct 
const updateProduct = async( req = request, res = response ) => {

    const { id } = req.params;
    const { state, user, ...data } = req.body;

    if ( data.name ) {
        data.name = data.name.toUpperCase();  
    } 
    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate( id, data, { new: true });

    res.json(product);
};

// deleteProduct - estate:false
const deleteProduct = async( req = request, res = response ) => {

    const { id } = req.params;

    const product = await Product.findByIdAndUpdate( id, { state: false }, { new: true });

    res.json(product);
}


module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
};
