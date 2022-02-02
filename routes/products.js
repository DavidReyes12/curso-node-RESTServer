const { Router } = require("express");
const { check } = require("express-validator");

const { validateJWT, validateFields, isAdmin } = require("../middlewares");

const { existProductById, existCategoryById } = require("../helpers/db-validators");

const { createProduct, 
        getProducts, 
        getProduct, 
        updateProduct, 
        deleteProduct 
    } = require("../controllers/products");

const router = Router();

/*
 * {{url}}/api/products
*/ 

// get all the products - public
router.get("/", getProducts);

// get a product by id - public
router.get("/:id", [
    check("id", "It's not a valid ID").isMongoId(),
    check("id").custom( existProductById ),
    validateFields,
], getProduct);

// Create a product - private - only with a valid token 
router.post("/", [ 
    validateJWT,
    check("name", "Name is required").not().isEmpty(),
    check("category", "It's not a valid ID").isMongoId(),
    check("category").custom( existCategoryById ),
    validateFields
], createProduct);

// Update a product - private - only with a valid token 
router.put("/:id",[ 
    validateJWT,
    check("id").custom( existProductById ),
    validateFields
], updateProduct);

// Delete a category - Admin 
router.delete("/:id", [ 
    validateJWT,
    isAdmin,
    check("id", "It's not a valid ID").isMongoId(),
    check("id").custom( existProductById ),
    validateFields
], deleteProduct);


module.exports = router;