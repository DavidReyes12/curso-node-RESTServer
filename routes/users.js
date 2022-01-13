const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares/validate-fields");
const { isValidRole, emailAlreadyExist, existUserById } = require("../helpers/db-validators");

const { getUsers, 
        putUsers, 
        postUsers, 
        patchUsers, 
        deleteUsers } = require("../controllers/users");

const router = Router();

router.get('/', getUsers);

router.post('/', [
        check("name", "Name is required").not().isEmpty(),
        check("password", "Password is required & it must be 6 characters or more").isLength({ min: 6 }),
        check("email", "Email is invalid").isEmail(),
        check("email").custom( emailAlreadyExist ),
        // check("role", "Role is not valid").isIn(["ADMIN_ROLE", "USER_ROLE"]),
        check("role").custom( isValidRole ),
        validateFields,
], postUsers);

router.put('/:id', [
        check("id", "It's not a valid ID").isMongoId(),
        check("id").custom( existUserById ),
        check("role").custom( isValidRole ),
        validateFields,
], putUsers);

router.patch('/', patchUsers);

router.delete('/:id', [
        check("id", "It's not a valid ID").isMongoId(),
        check("id").custom( existUserById ),
        validateFields,
], deleteUsers);

module.exports = router;
