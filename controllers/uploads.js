const path = require("path");
const fs = require("fs");

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { request, response } = require("express");
const { uploadFile: UploadFile } = require("../helpers");

const { User, Product } = require("../models");

const uploadFile = async( req = request, res = response) => {

    try {

        // txt, md
        // const name = await UploadFile( req.files, ["txt", "md"], "Text" );
        const name = await UploadFile( req.files, undefined, "Imgs" );
        res.json({ name });

    } catch (msg) {
        res.status(400).json({ msg });
    }

};

const updateFile = async( req = request, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case "users":

            model = await User.findById(id);

            if ( !model ) return res.status(400).json({
                msg: `User with id ${id} doesn't exist`
            })

            break;
        
        case "products":

            model = await Product.findById(id);
            
            if ( !model ) return res.status(400).json({
                msg: `Product with id ${id} doesn't exist`
            })

            break;
    
        default:
            return res.status(500).json({ msg: "I forgot validate this" });

    }

    // Clear previous img
    if ( model.img ) {
        // delete img from the DB
        const pathImage = path.join( __dirname, "../uploads/", collection, model.img );
        if ( fs.existsSync(pathImage) ) {
            fs.unlinkSync( pathImage );
        }
    }

    const name = await UploadFile( req.files, undefined, collection );
    model.img = name;

    await model.save();
    
    res.json( model );
    
};

const getImg = async( req = request, res= response ) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case "users":

            model = await User.findById(id);

            if ( !model ) return res.status(400).json({
                msg: `User with id ${id} doesn't exist`
            })

            break;
        
        case "products":

            model = await Product.findById(id);
            
            if ( !model ) return res.status(400).json({
                msg: `Product with id ${id} doesn't exist`
            })

            break;
    
        default:
            return res.status(500).json({ msg: "I forgot validate this" });

    }

    // Clear previous img
    if ( model.img ) {
        // get img
        const pathImage = path.join( __dirname, "../uploads/", collection, model.img );
        if ( fs.existsSync(pathImage) ) {
            return res.sendFile( pathImage );
        }
    }

    const pathImage = path.join( __dirname, "../assets/no-image.jpg" );

    res.sendFile( pathImage );

}

const updateFileCloudinary = async( req = request, res = response ) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case "users":

            model = await User.findById(id);

            if ( !model ) return res.status(400).json({
                msg: `User with id ${id} doesn't exist`
            })

            break;
        
        case "products":

            model = await Product.findById(id);
            
            if ( !model ) return res.status(400).json({
                msg: `Product with id ${id} doesn't exist`
            })

            break;
    
        default:
            return res.status(500).json({ msg: "I forgot validate this" });

    }

    // Clear previous img
    if ( model.img ) {
        // delete img from the DB Cloudinary
        const nameArr = model.img.split("/");
        const name = nameArr[ nameArr.length - 1 ];
        const [ public_id ] = name.split(".");
        cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    model.img = secure_url;

    await model.save();
    
    res.json( model );
    
};



module.exports = {
    uploadFile,
    updateFile,
    getImg,
    updateFileCloudinary
};
