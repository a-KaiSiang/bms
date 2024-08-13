const {getIncomeDetails} = require('../utility/sqlfunction');
const validateDate = require('../utility/validateDate');

async function getIncomeHandler(req, res){
    try {
        let currentMonth = req.query.m;
        let pass2Month = currentMonth - 2;
        let year = req.query.y;
    
        console.log(pass2Month)
        const currentMonthDateString = `${year}-${currentMonth}-01`;
        const pass2MonthDateString = `${year}-${pass2Month}-01`;

        if(!validateDate(currentMonthDateString) || !validateDate(pass2MonthDateString)){
            throw new Error("Date error.");
        }

        const incomeDetails = await getIncomeDetails(year, currentMonth, pass2Month.toString());

        res.status(200).json(incomeDetails);
        /*
        {
            partitionName : 
            createdDate :
            distributedAmount : 
            totalExpenses : 
            totalIncome : 
            balance :
        }
        */

    } catch (error) {
        console.error(error);
        res.status(500).json({errMsg:error});
    }
}

module.exports = getIncomeHandler;