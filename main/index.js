const express = require('express')();
const addIncomePartitionHandler = require('./addIncomePartition');
const getIncomePartitionHnadler = require('./getIncomePartition');
const insertNewTransactionHandler = require('./insertNewTransaction');
const modifyTransactionHandler = require('./modifyTransaction');

express.get('/getIncomePartition', getIncomePartitionHnadler);

express.post('/addIncomePartition', addIncomePartitionHandler);
express.post('/insertNewTransaction', insertNewTransactionHandler);

express.put('/modifyTransaction', modifyTransactionHandler);

module.exports = express;