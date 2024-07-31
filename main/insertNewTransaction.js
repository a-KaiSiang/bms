const validateDate = require('../utility/validateDate');
const {queryIncomePartition, addNewTransaction} = require('../utility/sqlfunction');

async function insertNewTransactionHandler(req, res){
    const {t} = req.body;

    try {
        //Promise.all will collect all promises provided into an array. When all promise in the array are resolved, Promise.all will be resolved as well.
        //Promise.all to collect all promise created by map() for validation.
        const failcase = await Promise.all(t.map(async (newTransactionRow) => {
            //setup for performing validation.
            const date = new Date(newTransactionRow.date);
            const formattedYearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
            //query will return an array with objects, instead of plain text.
            const query_allIncomePartitionForMonth = await queryIncomePartition(`${formattedYearMonth}-01`);
            const allIncomePartitionName = query_allIncomePartitionForMonth.map(elem => elem.partitionName);
            
            //check whether newTransactionRow contains invalid data.
            const isFailing = (
                //date validation
                !validateDate(`${newTransactionRow.date}`) ||
                //partitionName validation
                newTransactionRow.particular.length === 0 ||
                //debit & credit amount validation 1 : debit and credit should not exist at the same time.
                (newTransactionRow.debit.length !== 0 && newTransactionRow.credit.length !== 0) ||
                //debit & credit amount validation 2 : either debit and credit must have value.
                (newTransactionRow.debit.length === 0 && newTransactionRow.credit.length === 0) ||
                //debit & credit amount validation 3 : amount provided must be number.
                isNaN(newTransactionRow.debit) || 
                isNaN(newTransactionRow.credit) ||
                //affected income partition should exist.
                !allIncomePartitionName.includes(newTransactionRow.affectedPartition)
            );
            
            return isFailing ? newTransactionRow : null;
        }));

        //null values means row pass the validation test. Filter out them so that only fail case are remained.
        const filteredFailcase = failcase.filter(item => item !== null);

        //if failcase exist, throw error.
        if(filteredFailcase.length !== 0){
            console.log(failcase);
            // console.error(t);
            throw new Error("Invalid data type provided.");
        }

        console.log('validation passed');
        // const results = await addNewTransaction(t);
        await addNewTransaction(t);
        
        res.status(200).json({msg:"Transactions added successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({errMsg: `${error}`});
    }
}

module.exports = insertNewTransactionHandler;