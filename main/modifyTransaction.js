const {modifyTransaction, queryTransaction, queryIncomePartition} = require('../utility/sqlfunction');
const validateDate = require('../utility/validateDate'); 
const getDateString = require('../utility/getDateString');

async function modifyTransactionHandler(req, res){
    try {
        const {id, createdDate, particular, debit, credit, affectedPartition} = req.body;

        console.log(id);
        console.log(createdDate);
        console.log(particular);
        console.log(debit);
        console.log(credit);
        console.log(affectedPartition);
        //validate 
        //transaction should be valid.
        await queryTransaction(id);

        //date should be valid
        if(!validateDate(createdDate)){
            throw new Error('Invalid date!');
        }

        //particular is provided. 
        if(particular.length === 0 || !particular){
            throw new Error('Invalid particular!');
        }

        //debit and credit are not provided at the same time.
        const debitHasValue = parseFloat(debit) !== 0 ? true : false;
        const creditHasValue = parseFloat(credit) !== 0 ? true : false;
        if(debitHasValue && creditHasValue){
            throw new Error('Debit and credit side cannot both have non-zero values simultaneously.');
        }

        let amount; 
        if(debitHasValue){
            amount = parseFloat(debit * -1);
        }else if(creditHasValue){
            amount = parseFloat(credit);
        }else{
            throw newError('Invalid amount provided.')
        }

        //affected partition is valid.
        const transactionDate = new Date(createdDate);
        const transactionMonth = (transactionDate.getMonth()+1).toString();
        const formattedMonth = transactionMonth.length < 2 ? `0${transactionMonth}` : transactionMonth;
       
        const formattedDate = `${transactionDate.getFullYear()}-${formattedMonth}-01`;
        const incomePartitionAsAtDate = await queryIncomePartition(formattedDate);
        if(incomePartitionAsAtDate.filter(partition => partition.partitionName === affectedPartition).length !== 1){
            throw new Error('Invalid income partition');
        }

        const validatedData = {
            id: id,  
            createdDate: getDateString(createdDate), 
            particular: particular, 
            amount : amount,
            affectedPartition: affectedPartition
        }

        const result = await modifyTransaction(validatedData);
        res.status(200).json({msg: "Update success"});

    } catch (error) {
        console.error(error);
        res.status(400).json({errorMessage: error})
    }
}

module.exports = modifyTransactionHandler;