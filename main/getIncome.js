const {getIncomeDetails, verifyUserToken} = require('../utility/sqlfunction');
const validateDate = require('../utility/validateDate');

async function getIncomeHandler(req, res){
    try {
        // VERIFY user and its token.
        // const currentUser = req.query.u;
        // const userToken = req.query.t;

        // const verifiedUser = await verifyUserToken(currentUser, userToken);
        // if(!verifiedUser){
        //     res.status(403).json({errMsg:"Access denied."});
        //     return;
        // }

        let currentMonth = req.query.m;
        let pass2Month = currentMonth - 2;
        let year = req.query.y;
    
        const {uid} = req;

        // console.log(pass2Month)
        const currentMonthDateString = `${year}-${currentMonth}-01`;
        const pass2MonthDateString = `${year}-${pass2Month}-01`;

        if(!validateDate(currentMonthDateString) || !validateDate(pass2MonthDateString)){
            throw new Error("Date error.");
        }

        const incomeDetails = await getIncomeDetails(year, currentMonth, pass2Month.toString(), uid);

        res.status(200).json(incomeDetails);

    } catch (error) {
        console.error(error);
        res.status(500).json({errMsg:error});
    }
}

module.exports = getIncomeHandler;