const { format } = require('mysql2');
const {pool} = require('../database');
const getDateString = require('./getDateString');

async function insertNewIncomePartition(date, partitionRow){

    let connection;

    try {
        //get connection
        connection = await pool.getConnection();
        console.log('Connection promise success');

        //initialize date for querying and inserting data.
        const year = date.y;
        const month = date.m.length > 1 ? date.m : `0${date.m}`;
        const formattedDate = `${year}-${month}-01`; 

        //check if date has income partition created.
        const queryPartition = 'SELECT id FROM incomepartition WHERE createdDate = ?';
        const [result] = await connection.query(queryPartition, `${formattedDate}`);
        if(result.length > 0){
            throw new Error(`Partition for ${month}-${year} was created, please edit it instead.`);
        }

        //begin transaction to insert data.
        await connection.beginTransaction();

        //Initialize query and prepared statement.
        const query = 'INSERT INTO incomepartition(partitionName, createdDate, totalExpenses, totalIncome, distributedAmount) VALUES ?';
        
        const values = partitionRow.map(elem => {
            const distributed = parseFloat(elem.distributed).toFixed(2);
            return [`${elem.name}`, `${formattedDate}`, null, null, distributed];
        });

        //Execute insertion.
        const [results] = await connection.query(query, [values]);

        console.log(results);
        //Commit changes.
        await connection.commit();

        return results;
    } catch (error) {
        //When error thrown, log out and return the error.
        if(connection){
            await connection.rollback();
        }
        console.error(error);
        throw error;

    } finally {
        //after transaction done, release the connection.
        if(connection){
            connection.release();
        }
    }
}

async function queryIncomePartition(date){
    let connection;
    try {
        console.log(date);
        connection = await pool.getConnection();
        
        const query = "SELECT partitionName FROM incomepartition WHERE createdDate = ?"
        
        const [results] = await connection.query(query, [date]);

        console.log(results);
        return results;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        if(connection){
            connection.release;
        }
    }
}

async function addNewTransaction(newTransaction){
    // console.log(newTransaction);
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const query = `INSERT INTO transactions(createdDate, particular, amount, affectedPartition) VALUES ?`;
        const values = await Promise.all(newTransaction.map(async (transactionRow) => {
            const dateString = getDateString(transactionRow.date);
            const amount = transactionRow.debit.length === 0 ? transactionRow.credit : `-${transactionRow.debit}`
            console.log(dateString);
            return(
                [dateString, transactionRow.particular, amount, transactionRow.affectedPartition]
            )
        }));
        // console.log(values);
        const [results] = await connection.query(query, [values]);

        await connection.commit();
    } catch (error) {
         //When error thrown, log out and return the error.
        if(connection){
            await connection.rollback();
        }
        throw error;
    } finally {
        if(connection){
            connection.release();
        }
    }
}

async function queryTransaction(transactionId){
    let connection; 

    try {
        connection = await pool.getConnection();

        const query = 'SELECT COUNT(id) FROM transactions WHERE id = ?';
        
        const [result] = await connection.query(query, [transactionId]);
        console.log(result[0][`COUNT(id)`]);
        if(result[0][`COUNT(id)`] !== 1){
            throw new Error('Unexpected error happens when querying transaction. Please contact admin now.');
        }

        return result;
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if(connection){
            connection.release();
        }
    }
}

async function modifyTransaction({id, createdDate, particular, amount, affectedPartition}){
    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const updateQuery = 'UPDATE transactions SET createdDate = ?, particular = ?, amount = ?, affectedPartition = ? WHERE id = ?';
        const data = [createdDate, particular, amount, affectedPartition, id];

        const [result] = await connection.query(updateQuery, data);
        
        await connection.commit();     
        return result;   
    } catch (error) {
        //When error thrown, log out and return the error.
        if(connection){
            await connection.rollback();
        }
        throw error;

    } finally {
        if(connection){
            connection.release();
        }
    }
}

async function deleteTransaction(tid){
    let connection;

    try {
        connection = await pool.getConnection();

        const query = "DELETE FROM transactions WHERE id = ? ";
        const data = [tid];

        await connection.beginTransaction();

        const [result] = await connection.query(query, data);
        
        console.log(result);

        await connection.commit();
        return {msg: "Deletion done."};
    } catch (error) {
        if(connection){
            await connection.rollback();
        }

        throw error;
    } finally {
        if(connection){
            connection.release();
        }
    }
}

exports.insertNewIncomePartition = insertNewIncomePartition;
exports.queryIncomePartition = queryIncomePartition;
exports.addNewTransaction = addNewTransaction;
exports.queryTransaction = queryTransaction;
exports.modifyTransaction = modifyTransaction;
exports.deleteTransaction = deleteTransaction;