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
        console.log(data);

        return data;
    }catch(error){
        console.error('Error occurred : ', error);
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

        console.log(date);
        const bodyData = { 
            date: {
                m: createdMonth, 
                y: createdYear
            },
            ... incomePartition
        }

        const node = `${serverUrl}/addTransaction`;
        const reqConfig = {
            method: "POST",
            headers: {
                "Content-type" : "application/json",
            },
            body: JSON.stringify(bodyData),
        }

        const response = await fetch(node, reqConfig);
        if(!response.ok){
            throw new Error('Error when sending request to create income parititon.');
        }

        const data = await response.json();
        return data;
    }catch(error){
        console.error(error);
    }
}

exports.IncomePartitionDataSample = IncomePartitionDataSample;
exports.getTransaction = getTransaction;
exports.getIncome = getIncome;
exports.createNewIncomePartition = createNewIncomePartition;