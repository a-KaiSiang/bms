const express = require('express')();

const getIncomeDetailsHandler = require('./getIncome');
const addIncomePartitionHandler = require('./addIncomePartition');
const getTransactionHandler = require('./getTransaction');
const getIncomePartitionHnadler = require('./getIncomePartition');
const insertNewTransactionHandler = require('./insertNewTransaction');
const modifyTransactionHandler = require('./modifyTransaction');
const deleteTransactionHandler = require('./deleteTransaction');

express.get('/getIncomePartition', getIncomePartitionHnadler);
express.get('/getIncome', getIncomeDetailsHandler);
express.get('/getTransaction', getTransactionHandler);

express.post('/addIncomePartition', addIncomePartitionHandler);
express.post('/insertNewTransaction', insertNewTransactionHandler);

express.put('/modifyTransaction', modifyTransactionHandler);
express.delete('/deleteTransaction/:tid', deleteTransactionHandler);

module.exports = express;