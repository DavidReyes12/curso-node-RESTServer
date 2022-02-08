const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateFile } = require("../middlewares");
const { uploadFile, updateFile, getImg, updateFileCloudinary } = require("../controllers/uploads");
const { allowedCollections } = require("../helpers");

const router = Router();

// when you create something new you should use post 
router.post( "/", validateFile, uploadFile );

router.put( "/:collection/:id", [
    validateFile,
    check("id", "It's not a valid ID").isMongoId(),
    check("collection").custom( c => allowedCollections( c, ["users", "products"] ) ),
    validateFields
], updateFileCloudinary );
//], updateFile );

router.get( "/:collection/:id", [], getImg )


module.exports = router;