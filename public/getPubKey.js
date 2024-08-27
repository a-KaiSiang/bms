const fs = require('fs');
const forge = require('node-forge');

async function getPubKeyHandler(req, res){
    try{
        const certPem = fs.readFileSync('./static/cert.pem', "utf-8");
        const cert = forge.pki.certificateFromPem(certPem);
        const pubKey = forge.pki.publicKeyToPem(cert.publicKey);
        
        console.log(pubKey);

        res.status(200).json(pubKey);
    }catch(error){
        console.log(error);
        res.status(500).json({errMsg : "Error while reading key"});
    }
}

module.exports =  getPubKeyHandler;