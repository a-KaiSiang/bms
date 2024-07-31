const {insertNewIncomePartition} = require('../utility/sqlfunction')

async function addIncomePartitionHandler(req, res){
    const {date, partitionRow} = req.body;
    const dateElem = ['m','y'];

    partitionRow.map(elem => console.log(elem));

    try{
        // all fields should be provided with valid data.
        if(!validateDateElem(date, dateElem)){
            throw new Error("date error");
        }

        if(typeof(partitionRow) !== "object"){
            throw new Error("Partition error.");
        }

        /*
            balance, totalExpenses, totalIncome should be "-",
            distributed should be numeric value,
            indicate that it is initial set up of a new income partition.
        */
        partitionRow.map(partitionDetails => {
            if(partitionDetails.name.length === 0){
                throw new Error("Empty partition name.");
            }

            if(isNaN(partitionDetails.distributed)){
                throw new Error("Invalid disributed amount provided");
            }

            if(partitionDetails.totalExpenses !== "-" || partitionDetails.totalIncome !== "-" || partitionDetails.balance !== "-"){
                console.warn("Unknown device(s) calling to server.");
                throw new Error("Oops, something went wrong, please contact admin. X_X");
            }
        })

        // The time when creating income partition should be equal or exceed the current time.
        const currentTime = new Date();
        const currentMonth = currentTime.getMonth()+1;
        const currentYear = currentTime.getFullYear();

        if(currentMonth > date.m && currentYear > date.y){
            throw new Error("Date error");
        }
        
        // call to API to insert new income partition data.
        // result object of query will be returned.
        const resultOfInsert = await insertNewIncomePartition(date, partitionRow);

        //return message to client to indorm client that partition create successfully.
        res.status(200).json({message: "Insert Success"});
        
    }catch(errMsg){
        console.error(errMsg);
        res.status(400).json({errMessage : `${errMsg}`})
    }
}

function validateDateElem(dateElemArr1, serverDateElem){
    const lengthArr1 = Object.keys(dateElemArr1).length;
    const lengthArr2 = serverDateElem.length;

    if(lengthArr1 !== lengthArr2){
        return false;
    }

    for(let i = 0; i < lengthArr1; i++){
        if(!serverDateElem.includes(`${Object.keys(dateElemArr1)[i]}`)){
            return false;
        }
    }

    return true;
}

module.exports = addIncomePartitionHandler;