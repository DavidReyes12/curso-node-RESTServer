const { Router } = require("express");
const { check } = require("express-validator");

const { validateJWT, validateFields, isAdmin } = require("../middlewares");

const { existCategoryById } = require("../helpers/db-validators");

const { createCategory, 
        getCategories, 
        getCategory, 
        updateCategory, 
        deleteCategory 
    } = require("../controllers/categories");

const router = Router();

/*
 * {{url}}/api/categories
*/ 

// get all the categories - public
router.get("/", getCategories);

// get a category by id - public
router.get("/:id", [
    check("id", "It's not a valid ID").isMongoId(),
    check("id").custom( existCategoryById ),
    validateFields,
], getCategory);

// Create a category - private - only with a valid token 
router.post("/", [ 
    validateJWT,
    check("name", "Name is required").not().isEmpty(),
    validateFields
], createCategory);

// Update a category - private - only with a valid token 
router.put("/:id",[ 
    validateJWT,
    check("id").custom( existCategoryById ),
    check("name", "Name is required").not().isEmpty(),
    validateFields
], updateCategory);

// Delete a category - Admin 
router.delete("/:id", [ 
    validateJWT,
    isAdmin,
    check("id", "It's not a valid ID").isMongoId(),
    check("id").custom( existCategoryById ),
    validateFields
], deleteCategory);


module.exports = router;