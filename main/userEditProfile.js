const { updateProfile } = require('../utility/sqlfunction');
const fs = require('fs');
const jsencrypt = require('node-jsencrypt');

async function userEditProfileHandler(req, res){
    try {
        // console.log("skalksjdbas")
        const { dd } = req.body;
        console.log('dd', dd);

        const privateKey = fs.readFileSync('./static/key.pem', {encoding: "utf-8", flag:"r"});
        const decryptor = new jsencrypt();
        decryptor.setPrivateKey(privateKey);

        const decryptedData = decryptor.decrypt(dd);
        console.log('Decrypted data', decryptedData);
        const newUserProfile = JSON.parse(decryptedData);
        console.log('New user profile', newUserProfile);

        const resultUpdateUserProfile = await updateProfile(newUserProfile);
        if(!resultUpdateUserProfile){
            res.status(200).json({msg : "Update fail."});
            return;
        }

        res.status(200).json({msg : "Update success."});
    } catch (error) {
        console.error("Error when handling profile updation", error);
        res.status(500).json({errMsg : "Something went wrong when updating profile."})
    }
}

module.exports = userEditProfileHandler;