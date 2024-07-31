const express = require('express')();
const addIncomePartitionHandler = require('./addIncomePartition');
const getIncomePartitionHnadler = require('./getIncomePartition');
const insertNewTransactionHandler = require('./insertNewTransaction');

express.post('/addIncomePartition', addIncomePartitionHandler);
express.get('/getIncomePartition', getIncomePartitionHnadler);
express.post('/insertNewTransaction', insertNewTransactionHandler);

module.exports = express;