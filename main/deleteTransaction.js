const {deleteTransaction, queryTransaction} = require('../utility/sqlfunction');

async function deleteTransactionHandler(req, res){
    try {
        let tid = req.params.tid;
        console.log(tid)

        if(isNaN(tid)){
            throw new Error('Error id provided!');
        }

        const checkTransactionExists = await queryTransaction(tid);
        if(checkTransactionExists.length === 0){
            throw new Error('Invalid transaction.');
        }

        const result = await deleteTransaction(tid);
        console.log(result);

        res.status(200).json(result); 
        
    } catch (error) {
        console.error(error);
        res.status(400).json({errMsg: error});
    }
}

module.exports = deleteTransactionHandler;