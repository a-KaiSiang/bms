const IncomePartitionDataSample = [
    {name:"Bank", date:"2024-06-24", distributed:"1000", balance:"100", expenses:"1000", income:"3000"},
    {name:"Cash", date:"2024-06-24", distributed:"1000", balance:"100", expenses:"1000", income:"3000"},
    {name:"EWallet", date:"2024-06-24", distributed:"1000", balance:"100", expenses:"1000", income:"3000"}
]

const serverUrl = "http://localhost:3030"

async function getIncome(month, year) {
    try{
        const response = await fetch(`${serverUrl}/getIncome?m=${month}&y=${year}`);

        if(!response.ok){
            throw new Error('Error on network. Please try again later.');
        }

        const data = await response.json();
        // console.log(data);
        return data;
    }catch(error){
        console.error('Error occured : ', error);
    }
}

async function getTransaction(month, year){
    try{
        const response = await fetch(`${serverUrl}/getTransaction?m=${month}&y=${year}`);

        if(!response.ok){
            throw new Error('Error on network. Please try again later.')
        }

        const data = await response.json();
        // console.log(data);

        return data;
    }catch(error){
        console.error('Error occurred : ', error);
        return;
    }
}

async function createNewIncomePartition(date, incomePartition){
    try{
        if(!(date instanceof Date)){
            throw new Error('Wrong date format.');
        }

        // const formattedDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        // console.log(formattedDate);
        const createdMonth = date.getMonth() + 1; 
        const createdYear = date.getFullYear();

        console.log(incomePartition);
        console.log(date);
        const bodyData = { 
            date: {
                m: createdMonth, 
                y: createdYear
            },
            ... incomePartition
        }

        const url = `${serverUrl}/main/addIncomePartition`;
        const reqConfig = {
            method: "POST",
            headers: {
                "Content-type" : "application/json",
            },
            body: JSON.stringify(bodyData),
        }

        const response = await fetch(url, reqConfig);
        if(!response.ok){
            const errorData = await response.json();
            console.log(errorData);
            throw errorData.errMessage;
        }

        const data = await response.json();
        return data;
    }catch(error){
        console.error(error);
        throw error;
    }
}

async function getIncomePartition(date){
    if(typeof(date) !== "object"){
        throw new Error("Date format error.");
    }

    try {
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        console.log(year);
        const url = `${serverUrl}/main/getIncomePartition?m=${month}&y=${year}`;
        const response = await fetch(url);

        if(!response.ok){
            const errorData = await response.json();
            throw errorData;
        }

        const data = await response.json();
        // console.log(data);

        if(Object.keys(data).includes('errMsg')){
            console.log("Handling error. Please contact admin.");
            throw data;
        }

        // console.log(data);
        return data;
        
    } catch (error) {
        throw error;
    }
}

async function addNewTransaction(newTransactions){
    // console.log(newTransactions);
    try {
        const url = `${serverUrl}/main/insertNewTransaction`
        const bodyData = {
            t: newTransactions
        }
        const reqConfig = {
            method: "POST", 
            headers: {
                "Content-type" : "application/json",
            },
            body: JSON.stringify(bodyData),
        }

        const res = await fetch(url, reqConfig);
        if(!res.ok){
            const errorData = await res.json();
            throw errorData;
        }

        const queryResult = await res.json();

        console.log(queryResult);
        return queryResult;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function modifyTransaction(modifiedTransaction){
    try {
        const url=`${serverUrl}/main/modifyTransaction`
        const reqConfig = {
            method: "PUT", 
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify(modifiedTransaction)
        }

        const response = await fetch(url, reqConfig);
        if(!response.ok){
            const errorData = await response.json();
            throw errorData;
        }
        
        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error(error)
        return error.errMessage;
    }
}

async function deleteTransaction(transactionId){
    try {
        const url = `${serverUrl}/main/deleteTransaction/${transactionId}`
        const reqConfig = {
            method: "DELETE", 
            headers: {
                "Content-type" : "application/json"
            },
        }

        const response = await fetch(url, reqConfig);
        if(!response.ok){
            const errorData = await response.json();
            throw errorData;
        }
        
        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error(error)
        return error.errMessage;
    }
}

exports.IncomePartitionDataSample = IncomePartitionDataSample;
exports.getTransaction = getTransaction;
exports.getIncome = getIncome;
exports.createNewIncomePartition = createNewIncomePartition;
exports.getIncomePartition = getIncomePartition;
exports.addNewTransaction = addNewTransaction;
exports.modifyTransaction = modifyTransaction;