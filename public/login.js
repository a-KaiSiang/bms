const JSEncrypt = require('node-jsencrypt');
const fs = require('fs');
const {login} = require('../utility/sqlfunction');

async function loginHandler(req, res){
    try {
        const encryptUsername = req.body.u;
        const encryptPassword = req.body.p;

        // console.log(req);
        const privateKey = fs.readFileSync('./static/key.pem', {encoding:"utf-8", flag:"r"});
        // console.log(privateKey);
        const decryptor = new JSEncrypt();
        decryptor.setPrivateKey(privateKey);

        const username = decryptor.decrypt(encryptUsername);
        const password = decryptor.decrypt(encryptPassword);
        // console.log(encryptUsername);

        const userData = await login(username, password);
        // console.log(userData);
        
        res.status(200).json({msg:"Login Success", ...userData});

    } catch (error) {
        console.error(error);
        res.status(400).json({errMsg : "Login fail"});
    }
}

module.exports = loginHandler;