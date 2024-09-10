const { verifyUserIdentity }  = require('../utility/sqlfunction');
const fs = require('fs');
const jsencrypt = require('node-jsencrypt');

async function verifyUserIdentityHandler(req, res){
    try {
        const { d } = req.body;
        console.log('d', d);

        const privateKey = fs.readFileSync('./static/key.pem', {encoding:"utf-8", flag:"r"});
        const decryptor = new jsencrypt();
        decryptor.setPrivateKey(privateKey);

        // console.log('Private key ',privateKey);
        const decryptedData  = decryptor.decrypt(d);
        console.log('Decrypted Data ', decryptedData);

        const { u, p, t } = JSON.parse(decryptedData);
        console.log('User data', u, p, t); 

        const validationResult = await verifyUserIdentity(u, p, t);

        // varifyUserIdentity should return boolean value.
        if(!validationResult){
            res.status(200).json({errMsg : "Validation fail"});
            return;
        }

        res.status(200).json({msg : "Validation pass."});
    } catch (error) {
        res.status(500).json({errMsg : "Something went wrong when verifying user identity."});
    }
}

module.exports = verifyUserIdentityHandler;