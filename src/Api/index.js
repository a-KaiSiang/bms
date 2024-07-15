const IncomePartitionDataSample = [
    {name:"Bank", date:"2024-06-24", distributed:"1000", balance:"100", expenses:"1000", income:"3000"},
    {name:"Cash", date:"2024-06-24", distributed:"1000", balance:"100", expenses:"1000", income:"3000"},
    {name:"EWallet", date:"2024-06-24", distributed:"1000", balance:"100", expenses:"1000", income:"3000"}
]

async function getTransaction(month, year){
    try{
        const response = await fetch(`http://localhost:3030/getTransaction?m=${month}&y=${year}`);

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

exports.IncomePartitionDataSample = IncomePartitionDataSample;
exports.getTransaction = getTransaction;