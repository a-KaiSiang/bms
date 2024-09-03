const express = require('express')();
const { verifyUserToken } = require('../utility/sqlfunction');

async function verifyUser(req, res, next){
    let u, t;
    if(req.method === "GET"){
        u = req.query.u;
        t = req.query.t;
    }else{
        u = req.body.u;
        t = req.body.t;
    }

    const verifyUserId = await verifyUserToken(u, t);

    if(!verifyUserId) {
        res.status(401).json({errMsg : "Access denied."})
    };

    req.uid = verifyUserId;
    next();
}

const getIncomeDetailsHandler = require('./getIncome');
const addIncomePartitionHandler = require('./addIncomePartition');
const getTransactionHandler = require('./getTransaction');
const getIncomePartitionHandler = require('./getIncomePartition');
const insertNewTransactionHandler = require('./insertNewTransaction');
const modifyTransactionHandler = require('./modifyTransaction');
const deleteTransactionHandler = require('./deleteTransaction');

express.get('/getIncomePartition', getIncomePartitionHandler);
express.get('/getIncome', verifyUser, getIncomeDetailsHandler);
express.get('/getTransaction', verifyUser, getTransactionHandler);

express.post('/addIncomePartition', addIncomePartitionHandler);
express.post('/insertNewTransaction', verifyUser, insertNewTransactionHandler);

express.put('/modifyTransaction', verifyUser, modifyTransactionHandler);
express.delete('/deleteTransaction/:tid', deleteTransactionHandler);

module.exports = express;