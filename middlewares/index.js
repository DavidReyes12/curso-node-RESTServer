const validateFields = require("../middlewares/validate-fields");
const validateJWT    = require("../middlewares/validate-jwt");
const haveRole       = require("../middlewares/validate-roles");
const validateFile   = require("../middlewares/validate-file");

module.exports = {
    ...validateFields,
    ...validateJWT,
    ...haveRole,
    ...validateFile
};
