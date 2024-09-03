const {getTransactionData,verifyUserToken} = require('../utility/sqlfunction');

async function getTransactionHandler(req, res){
    try {
        // const currentUser = req.query.u;
        // const userToken = req.query.t;

        // const verifiedUser = await verifyUserToken(currentUser, userToken);
        // if(!verifiedUser){
        //     res.status(403).json({errMsg:"Access denied."});
        //     return;
        // }

        const month = req.query.m; 
        const year = req.query.y;
        
        const {uid} = req;

        const transactionsLast3Month = await getTransactionData(month, year, uid);

        console.log(transactionsLast3Month);
        res.status(200).json(transactionsLast3Month);
    } catch (error) {
        console.error(error);
        res.status(500).json({errMsg : "Something went wrong when getting transactions."});
    }
}

module.exports = getTransactionHandler;