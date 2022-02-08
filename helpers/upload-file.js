const path = require("path");
const { v4: uuidv4 } = require('uuid');

const uploadFile = ( files, validExtensions = ["png", "jpg", "jpeg", "gif"], folder = "" ) => {

    return new Promise( ( resolve, reject ) => {

        const { file } = files;

        const cutedName = file.name.split(".");
        const extension = cutedName[ cutedName.length - 1 ]; 

        // Extension validate
        if ( !validExtensions.includes(extension) ) return reject(`Extension ${extension} it's not allowed`);

        const tempName = uuidv4() + "." + extension;
        const uploadPath = path.join( __dirname, '../uploads/', folder, tempName );

        file.mv(uploadPath, function(err) {
            if (err) return reject( err );

            resolve( tempName );
        });

    });

}


module.exports = {
    uploadFile
};
