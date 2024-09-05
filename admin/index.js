const express = require('express')();
const { verifyAdminToken } = require('../utility/sqlfunction');

async function verifyAdmin(req, res, next){
    let adminName, adminToken;
    
    if(req.method === "POST"){
        adminName = req.body.an;
        adminToken = req.body.at;
    }else if(req.method === "GET"){
        adminName = req.query.an;
        adminToken = req.body.at;
    }

    if(!adminName || !adminToken ){
        console.error("System error : No admin information has been received.");
        res.status(401).json({errMsg : "Invalid data received."});
        return;
    }

    const verificationResult = await verifyAdminToken(adminName, adminToken);

    if(!verificationResult){
        console.error("System error : User attemping to perform admin behavior.");
        res.status(401).json({errMsg : "Invalid user"});
        return;
    }

    next();
}

const createUserHandler = require("./createUser");

express.post("/createUser", verifyAdmin, createUserHandler);

module.exports = express;