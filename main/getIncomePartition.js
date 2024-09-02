const {queryIncomePartition, verifyUserToken} = require('../utility/sqlfunction');
const validateDate = require('../utility/validateDate');

async function getIncomePartionHandler(req, res){
    try{
        const currentUser = req.query.u;
        const userToken = req.query.t;

        const verifiedUser = await verifyUserToken(currentUser, userToken);
        if(!verifiedUser){
            res.status(403).json({errMsg:"Access denied."});
            return;
        }

        const {m, y} = req.query;
        const formattedMonth = m.length < 2 ? `0${m}` : `${m}`;
        const dateString = `${y}-${formattedMonth}-01`;
        
        if(!validateDate(dateString)){
            throw new Error('Date format error.');
        }

        const data = await queryIncomePartition(dateString, verifiedUser);
        // console.log(data);
        if(data.length === 0){
            res.status(400).json({errMsg:"Income partition has not been created."});
            return
        }

        res.status(200).json(data);
    }catch(error){
        console.error(error);
        res.status(500).json({errMsg: `${error}`});
    }

}

module.exports = getIncomePartionHandler;