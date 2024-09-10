const IncomePartitionDataSample = [
    {name:"Bank", date:"2024-06-24", distributed:"1000", balance:"100", expenses:"1000", income:"3000"},
    {name:"Cash", date:"2024-06-24", distributed:"1000", balance:"100", expenses:"1000", income:"3000"},
    {name:"EWallet", date:"2024-06-24", distributed:"1000", balance:"100", expenses:"1000", income:"3000"}
]

const serverUrl = "http://localhost:3030"

export async function getPubKey(){
    try {
        const reqUrl = `${serverUrl}/public/getPubKey`;
        const reqConfig = {
            method: "GET",
            headers: {
                Authorization : "asjkgasdyucvqw98x7a97egqi2wx",
                "Content-type" : "text/html"
            }
        }
    
        const res = await fetch(reqUrl, reqConfig);
        if(!res.ok){
            const errorMsg = await res.json();
            throw errorMsg.errMsg;
        }

        const pubKey = await res.json();
        return pubKey;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function login(username, password){
    try {
        const reqUrl = `${serverUrl}/public/login`;
        const body = {
            u : username, 
            p : password
        }
        const reqConfig = {
            method : "POST",
            headers : {
                Authorization : "asjkgasdyucvqw98x7a97egqi2wx",
                "Content-type": "application/json",
            },
            body : JSON.stringify(body)
        }

        const res = await fetch(reqUrl, reqConfig);
        if(!res.ok){
            const errorMsg = await res.json();
            throw errorMsg.errMsg;
        }

        const userData = await res.json();
        return userData;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getIncome(month, year) {
    try{
        const username = localStorage.getItem("u");
        console.log(username);
        const userToken = localStorage.getItem("t");

        const reqUrl = `${serverUrl}/main/getIncome?u=${username}&t=${userToken}&m=${month}&y=${year}`;
        const reqConfig = {
            method: "GET",
            headers : {
                Accept : "application/json"
            }
        }

        const response = await fetch(reqUrl, reqConfig);

        if(!response.ok){
            const errorData = await response.json();
            throw errorData;
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch(error){
        console.error('Error occured : ', error);
        throw error.errMsg;
    }
}

export async function getTransaction(month, year, username, token){
    try{
        const reqUrl = `${serverUrl}/main/getTransaction?u=${username}&t=${token}&m=${month}&y=${year}`
        const reqConfig = {
            method : "GET",
            headers : {
                Accept : "application/json"
            }
        }
        const response = await fetch(reqUrl, reqConfig);

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

export async function createNewIncomePartition(date, incomePartition, username, token){
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
            u: username, 
            t: token,
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

export async function getIncomePartition(date, username, token){
    if(typeof(date) !== "object"){
        throw new Error("Date format error.");
    }

    try {

        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const reqUrl = `${serverUrl}/main/getIncomePartition?u=${username}&t=${token}&m=${month}&y=${year}`
        const reqConfig = {
            method : "GET", 
            headers : {
                Accept : "application/json"
            }
        }

        console.log(year);
        const url = ``;
        const response = await fetch(reqUrl, reqConfig);

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

export async function addNewTransaction(newTransactions, username, token){
    // console.log(newTransactions);
    try {
        const url = `${serverUrl}/main/insertNewTransaction`
        const bodyData = {
            transaction: newTransactions,
            u: username, 
            t: token
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

export async function modifyTransaction(modifiedTransaction, username, token){
    try {
        const userInfo = {
            u : username, 
            t : token
        }
        console.log(userInfo);

        const url=`${serverUrl}/main/modifyTransaction`
        const reqConfig = {
            method: "PUT", 
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify({...modifiedTransaction, ...userInfo})
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

export async function deleteTransaction(transactionId){
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
        return result.msg;

    } catch (error) {
        console.error(error)
        return error.errMessage;
    }
}

export async function createUser(username, password){
    console.log('skskkssasca7strcaus');
    try {
        const reqUrl = `${serverUrl}/admin/createUser`;
        const bodyData = {
            an : localStorage.getItem("u"),
            at : localStorage.getItem("t"),
            nu : username, 
            np : password
        }
        const reqConfig = {
            method : "POST",
            headers : {
                "Content-type" : "application/json",
            },
            body : JSON.stringify(bodyData)
        }
        
        const res = await fetch(reqUrl, reqConfig);

        if(!res.ok){
            const errorData = await res.json();
            throw errorData.errMsg;
        }
        
        const insertUser = await res.json();
        return insertUser.msg;

    } catch (error) {
        throw error;
    }
}

export async function validateUser(enc_credentials){
    try {
        const reqUrl = `${serverUrl}/main/verifyUserIdentity`;
        const bodyData = {
            d : enc_credentials
        }
        const reqConfig = {
            method : "POST", 
            headers : {
                "Content-type" : "application/json",
            },
            body : JSON.stringify(bodyData)
        }

        const response = await fetch(reqUrl, reqConfig);
        
        if(!response.ok){
            const errMessage = await response.json();
            throw errMessage.errMsg;
        }

        // Once response is received, return the data and let the page to handle the error.
        const resultValidateUser = await response.json();

        return resultValidateUser;
        // console.log(enc_credentials);
    } catch (error) {
        // this code is intended to catch only unhandled error.
        console.error("User validation", error);
        throw error;
    }
}

export async function userEditProfile(enc_updatedProfile){
    try {
        const reqUrl = `${serverUrl}/main/userEditProfile`;
        console.log(enc_updatedProfile);
        const updatedUserProfile = {
            dd : enc_updatedProfile
        };
        const reqConfig = {
            method : "POST",
            headers : {
                "Content-type" : "application/json"
            },
            body : JSON.stringify(updatedUserProfile),
        };

        const response = await fetch(reqUrl, reqConfig);
        if(!response.ok){
            const errMessage = await response.json();
            throw errMessage.errMsg;
        }

        const resultEditProfile = await response.json();
        return resultEditProfile;
        
    } catch (error) {
        console.error('Profile edition fail', error);
        throw error;
    }
}
// exports.getIncome = getIncome;
// exports.createNewIncomePartition = createNewIncomePartition;
// exports.getIncomePartition = getIncomePartition;
// exports.getTransaction = getTransaction;
// exports.addNewTransaction = addNewTransaction;
// exports.modifyTransaction = modifyTransaction;
// exports.deleteTransaction = deleteTransaction;