const {getTransactionData} = require('../utility/sqlfunction');

async function getTransactionHandler(req, res){
    try {
        const month = req.query.m; 
        const year = req.query.y;

        const transactionsLast3Month = await getTransactionData(month, year);

        console.log(transactionsLast3Month);
        res.status(200).json(transactionsLast3Month);
    } catch (error) {
        console.error(error);
        res.status(500).json({errMsg : "Something went wrong when getting transactions."});
    }
}

module.exports = getTransactionHandler;