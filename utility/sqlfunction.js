const {pool} = require('../database');
const getDateString = require('./getDateString');

async function login(username, password){
    let connection;

    try {
        connection = await pool.getConnection();

        const query = "SELECT username AS u, password AS p, token AS t FROM users WHERE BINARY username = ? LIMIT 1";

        // console.log(username);
        const [result] = await connection.query(query, [username]);
        // console.log(result);
        const {u, p, t} = await result[0];
        if(p !== password){
            const errMsg = "Login credentials error";
            throw errMsg;
        }

        return {u,t};

    } catch (error) {
        console.error(error);
        throw error;

    } finally {
        if(connection){
            connection.release();
        }
    }
}

async function verifyUserToken(username,token){
    let connection; 

    try {
        connection = await pool.getConnection();

        const query = "SELECT id, token AS uToken FROM users WHERE BINARY username = ?";

        const [userToken] = await connection.query(query, [username]);

        if(userToken.length === 0){
            return false;
        }
        
        const uToken = userToken[0].uToken;
        if(uToken !== token){
            return false;
        }
        const uid = userToken[0].id

        return uid;

    } catch (error) {
        console.log(error);
        throw {errMsg : "Something went wrong when querying income data."}

    } finally {
        if(connection){
            connection.release();
        }
    }
}

verifyUserToken();

async function insertNewIncomePartition(date, partitionRow, uid){

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
        const query = 'INSERT INTO incomepartition(userId, partitionName, createdDate, distributedAmount) VALUES ?';
        
        const values = partitionRow.map(elem => {
            const distributed = parseFloat(elem.distributed).toFixed(2);
            return [uid, `${elem.name}`, `${formattedDate}`, distributed];
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

async function queryIncomePartition(date, userId){
    let connection;
    try {
        console.log(date);
        connection = await pool.getConnection();
        
        const query = "SELECT partitionName FROM incomepartition WHERE createdDate = ? AND userId = ?"
        
        const [results] = await connection.query(query, [date, userId]);

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

async function getIncomeDetails(year, currentMonth, pass2Month, uid){
    let connection;

    try{
        const currentDate = `${year}-${currentMonth.length < 2 ? `0${currentMonth}` : `${currentMonth}`}-01`;
        const pass2MonthDate = `${year}-${pass2Month.length < 2 ? `0${pass2Month}` : `${pass2Month}`}-01`

        connection = await pool.getConnection();

        const queryIncomeDetails = 
            `SELECT ` + 
                `YEAR(incomepartition.createdDate) AS year, ` +
                `MONTH(incomepartition.createdDate) AS month, ` + 
                `incomepartition.partitionName, ` + 
                `SUM(CASE WHEN transactions.amount < 0 THEN amount ELSE 0 END) AS totalExpenses, ` + 
                `SUM(CASE WHEN transactions.amount > 0 THEN amount ELSE 0 END) AS totalIncome, ` +
                `incomepartition.distributedAmount ` +
            `FROM incomepartition ` +
            `LEFT JOIN ` + 
                `transactions ON ` +
                `incomepartition.partitionName = transactions.affectedPartition ` + 
                `AND YEAR(incomepartition.createdDate) = YEAR(transactions.createdDate) ` +
                `AND MONTH(incomepartition.createdDate) = MONTH(transactions.createdDate) ` + 
                `AND transactions.createdDate BETWEEN '${pass2MonthDate}' AND LAST_DAY('${currentDate}') ` +
            `WHERE ` + 
                `incomepartition.userId = ${uid} ` + 
            `GROUP BY ` + 
                `YEAR(incomepartition.createdDate), MONTH(incomepartition.createdDate), incomepartition.partitionName, incomepartition.distributedAmount ` +
            `ORDER BY ` + 
                `YEAR(incomepartition.createdDate), MONTH(incomepartition.createdDate) DESC `;

        const [incomeDetails] = await connection.query(queryIncomeDetails);
        console.log(incomeDetails);

        return incomeDetails;

    }catch(error){
        console.error(error);
        throw new Error("Something went wrong when getting income details.");

    }finally{
        if(connection){
            connection.release();
        }
    }
}

async function getTransactionData(month, year, userId){
    let connection;

    try {
        connection = await pool.getConnection();

        const query = `SELECT * FROM transactions WHERE MONTH(createdDate) = ? AND YEAR(createdDate) = ? AND userId = ${userId}`;

        const [transactions] = await connection.query(query,[month, year]);

        // console.log(transactions);
        return transactions;
        
    } catch (error) {
        console.error(error);
        throw new Error("Something went wrong when getting income details.");

    } finally {
        if(connection){
            connection.release();
        }
    }
}


async function addNewTransaction(newTransaction, uid){
    // console.log(newTransaction);
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const query = `INSERT INTO transactions(createdDate, userId, particular, amount, affectedPartition) VALUES ?`;
        const values = await Promise.all(newTransaction.map(async (transactionRow) => {
            const dateString = getDateString(transactionRow.date);
            const amount = transactionRow.debit.length === 0 ? transactionRow.credit : `-${transactionRow.debit}`
            console.log(dateString);
            return(
                [dateString, uid, transactionRow.particular, amount, transactionRow.affectedPartition]
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

async function modifyTransaction({id, createdDate, particular, amount, affectedPartition, uid}){
    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const updateQuery = 'UPDATE transactions SET createdDate = ?, particular = ?, amount = ?, affectedPartition = ? WHERE id = ? AND userId = ? ';
        const data = [createdDate, particular, amount, affectedPartition, id, uid];
        
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

exports.login = login;
exports.verifyUserToken = verifyUserToken;
exports.getIncomeDetails = getIncomeDetails;
exports.insertNewIncomePartition = insertNewIncomePartition;
exports.queryIncomePartition = queryIncomePartition;
exports.getTransactionData = getTransactionData;
exports.addNewTransaction = addNewTransaction;
exports.queryTransaction = queryTransaction;
exports.modifyTransaction = modifyTransaction;
exports.deleteTransaction = deleteTransaction;