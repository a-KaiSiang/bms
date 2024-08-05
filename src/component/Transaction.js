import React, {useEffect, useState} from "react"
import DatePicker from "react-datepicker"
import { getTransaction, getIncomePartition, addNewTransaction, modifyTransaction, deleteTransaction } from "../Api";

import styles from "../css/Transaction.module.css"
import "react-datepicker/dist/react-datepicker.css";

export default function Transaction(){
    const [transactionDate, setTransactionDate] = useState(new Date());
    const [newTransaction, setNewTransaction] = useState([]);
    const [currentTransaction, setCurrentTransaction] = useState([]);
    const [incomePartition, setIncomePartition] = useState([]);

    useEffect(() => {
        const getTransactionData = async()=>{
            try{
                const data = await getTransaction(transactionDate.getMonth()+1, transactionDate.getFullYear());
                setCurrentTransaction(data);
    
            }catch(error) {
                console.error('Error fetching transactions', error);
    
            }
        }
        getTransactionData();
    }, [transactionDate.getMonth(), transactionDate.getFullYear()])

    useEffect(() => {
        const requestIncomePartition = async() => {
            try {
                console.log('getting income partition');

                const incomePartitionAsAtDate = await getIncomePartition(transactionDate);
                // console.log(incomePartitionAsAtDate);
                const incomePartitionsName = incomePartitionAsAtDate.map(partitionDetail => partitionDetail.partitionName);
                setIncomePartition(incomePartitionsName);
                
            } catch (error) {
                console.error(error.errMsg);
                // alert(error.errMsg);
                setIncomePartition([]);
            }           
        }

        requestIncomePartition();
    }, [transactionDate.getMonth(), transactionDate.getFullYear()])

    function handleClick(){
        setNewTransaction([...newTransaction, {date:transactionDate, particular:"", debit:"", credit:"", affectedPartition:""}]);
    }

    async function handleSubmit(){
        console.log(newTransaction);
        try {
            //check if newTransaction is filled with data.
            if(newTransaction.length === 0){
                throw "New transaction has not set yet.Don't be stupid";
            }

            let failCase = newTransaction.filter(transactionRow => (
                //return if affectedPartition has no value.
                transactionRow.affectedPartition.length === 0 ||
                //return if affectedPartition does not exist.
                !incomePartition.includes(transactionRow.affectedPartition) ||
                //return if debit and credit have value at the same time.
                (transactionRow.debit.length !== 0 && transactionRow.credit.length !== 0) || 
                //return if particular does not contain value.
                transactionRow.particular.length === 0
            ))

            if(failCase.length !== 0){
                throw "Input error. Please check your new transaction.";
            }

            const result = await addNewTransaction(newTransaction);
            
            alert(result.msg);
        } catch (error) {
            console.log(error);
            alert(error);
            return;
        }
    }

    return (
        <div className="partitionContainer">
            <h1 style={{paddingLeft : "20px", margin: "25px 20px", color:"#F5F5F5"}}>Transaction</h1>
            <hr></hr>

            <div style={{display:"flex", justifyContent: "space-between",margin: "5px",height: "50px"}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"baseline",justifyContent:"center"}}>
                    <DatePicker 
                        selected={transactionDate} 
                        onChange={(date) => setTransactionDate(date)} dateFormat="dd/MM/yyyy"
                    />
                </div>
                
                <button 
                    type="button"  
                    className="createNewPartition"
                    onClick={handleClick}    
                >
                    <span>Add Transaction</span>
                </button>
            </div>

            <div className={`${styles.transactionTable}`}>
                <div className={styles.transactionHeader}>
                    <div className={`${styles.headerElem} dcc`} style={{backgroundColor:"#F5DEB3"}}>Date</div>
                    <div className={`${styles.headerElem} dcc`} style={{backgroundColor:"#F5DEB3"}}>Particular</div>
                    <div className={`${styles.headerElem} dcc`} style={{backgroundColor:"#F5DEB3"}}>Debit</div>
                    <div className={`${styles.headerElem} dcc`} style={{backgroundColor:"#F5DEB3"}}>Credit</div>
                    <div className={`${styles.headerElem} dcc`} style={{backgroundColor:"#F5DEB3", textAlign:"center"}}>Affected Partition</div>
                    <div className={`${styles.headerElem} dcc`} style={{backgroundColor:"#F5DEB3"}}></div>
                    <div className={`${styles.headerElem} dcc`} style={{backgroundColor:"#F5DEB3"}}></div>
                </div>

                <div className={styles.scrollContainer} style={{maxHeight: "300px", overflowY:"scroll", overflowX:"hidden"}}>
                    <TransactionRow currentTransaction={currentTransaction} incomePartition={incomePartition}/>
                    <InsertNewTransaction newTransaction={newTransaction} setNewTransaction={setNewTransaction} incomePartition={incomePartition}/>
                </div>
            </div>
            {newTransaction.length > 0 && <div className="confirmNewTransaction"><button style={{width:"30%"}} onClick={handleSubmit}>Confirm</button></div>}
        </div>
    )
}

function TransactionRow({currentTransaction, incomePartition}) {
    function initializeEditState(){
        if(currentTransaction.length === 0){
            return;
        }
        return ( 
            currentTransaction.reduce((initializedRow, transRow) => {
                return {
                    ...initializedRow, 
                    [transRow.id] : false
                }
            }, {})
        )
    }

    console.log(currentTransaction);
    const [bufferForEditingTran, setBufferForEditingTran] = useState([]);
    const [editingTransaction, setEditingTransaction] = useState(initializeEditState());
    
    useEffect(() => {
        const checkCurrentTransaction = async () => {
            if(currentTransaction.length === 0){
                console.log('No current transaction at this month');
                return;
            }
            const eee = initializeEditState();
                
            console.log(eee);
            setEditingTransaction(eee);
            console.log('Current transaction at this month found');
        }

        checkCurrentTransaction()
    }, [currentTransaction])

    useEffect(() => {
        //In default, array and object will be parsed as references, 
        //which imply that modification on any variable that been assign with the original object/array will affect the original variable too. 
        //To avoid unintentional modification made on origial variable, parse them to string and parse them to array/object subsequently.
        const transactionBuffer = JSON.parse(JSON.stringify(currentTransaction));
        const formattedTransactionBuffer = transactionBuffer.map(row => {
            const {affectedPartition, amount, createdDate, id, particular} = row;
            const bufferDataToReceiveInput = {
                id: id, 
                createdDate: createdDate,
                particular: particular,
                debit : parseFloat(amount) < 0 ? (amount*-1)  : 0,
                credit : parseFloat(amount) > 0 ? amount : 0,
                affectedPartition : affectedPartition, 
            }
            return bufferDataToReceiveInput;
        })

        setBufferForEditingTran(formattedTransactionBuffer);
    }, [currentTransaction])

    useEffect(()=>{
        console.log(bufferForEditingTran)
    }, [bufferForEditingTran]);

    function handleEdit(transactionId){
        console.log(transactionId);
        const enableItemToUpdate = {
            ...editingTransaction,
            [`${transactionId}`] : true
        }
        console.log(editingTransaction);

        setEditingTransaction(enableItemToUpdate);
    }

    function handleCancel(transactionId, idx){
        // disable edit status.
        const disableItemToUpdate = {
            ...editingTransaction,
            [`${transactionId}`] : false
        }
        setEditingTransaction(disableItemToUpdate);

        //revert changes made while edit is enabled.
        const revertedArr = bufferForEditingTran.map((dataRow, i) => {
            if(i === idx){
                const originalTransOfRow = JSON.parse(JSON.stringify(currentTransaction[i]));
                const {id, createdDate, particular, amount, affectedPartition} = originalTransOfRow;

                const formattedData = {
                    id: id, 
                    createdDate : createdDate, 
                    particular : particular, 
                    debit: parseFloat(amount) < 0 ? amount*-1 : 0, 
                    credit: parseFloat(amount) > 0 ? amount : 0,
                    affectedPartition: affectedPartition
                } 

                return formattedData;
            }else{
                return dataRow;
            }
        });
        console.log(revertedArr);
        setBufferForEditingTran(revertedArr);
    }

    async function handleSave(transactionId){
        try {
            //validate.
            const savingData = bufferForEditingTran.filter(bufferRow => bufferRow.id === transactionId);
            console.log(savingData);
            // return

            //id must be unique.
            if(savingData.length !== 1){
                alert('Id must be unique, please contact admin.');
                return;
            }

            //modifications must be made.
            const originalDataOfModifiedRow = currentTransaction.filter(currentRow => currentRow.id === transactionId);
            const debitCredit = JSON.parse(JSON.stringify(savingData[0]));
            const organizeDebitCreditToAmount = [{
                id:debitCredit.id, 
                createdDate: debitCredit.createdDate, 
                particular: debitCredit.particular, 
                amount: debitCredit.debit > 0 ? `${parseFloat(-1*debitCredit.debit).toFixed(2)}` : `${parseFloat(debitCredit.credit).toFixed(2)}`,
                affectedPartition: debitCredit.affectedPartition
            }];

            const checkDataModified = JSON.stringify(organizeDebitCreditToAmount) !== JSON.stringify(originalDataOfModifiedRow) ? true : false;

            if(!checkDataModified){
                alert('Changes are essential to update data.');
                return;
            }

            //particular name should be set.
            const checkParticularNameSet = savingData[0].particular.length > 0 ? true : false;
            if(!checkParticularNameSet){
                alert('Particular name should not be empty');
                return;
            }

            //either debit or credit should be entered, but not both of them.
            const doDebitSideHasValue = parseFloat(savingData[0].debit) !== 0 ? true : false;
            const doCreditSideHasValue = parseFloat(savingData[0].credit) !== 0 ? true : false;
            const checkIfAmountValid = doDebitSideHasValue !== doCreditSideHasValue ? true : false;
            if(!checkIfAmountValid){
                alert('Debit and credit side could not have the same value at the same time.');
                return;
            }

            //Affected partition should be valid.
            const doesAffectedPartitionValid = incomePartition.includes(savingData[0].affectedPartition) ? true : false;
            if(!doesAffectedPartitionValid){
                alert('Income partition should be valid');
                return;
            }

            //send to database.
            const result = await modifyTransaction(savingData[0]);

            if(result.msg){
                alert(result.msg);
            }
            setEditingTransaction(initializeEditState());

        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    async function handleDelete(transactionId){
        //get id of deleting row and check if id is number.
        try{
            if(window.confirm('Are you sure to delete this transaction? Delete is not revertable.')){
                if(isNaN(transactionId)){
                    throw new Error('Invalid transaction id');
                }
    
                const queryResult = await deleteTransaction(transactionId);
                console.log(queryResult);
                alert(queryResult);
            }else{
                alert('Delete cancel...');
            }
        }catch(error){
            console.error(error);
            alert(error);
        }

        
        //send request to database.
    }

    const data = bufferForEditingTran.map((trans, idx) => {
        const date = new Date(`${trans.createdDate}`);

        const formattedDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`

        return(
            <div key={trans.id} className={styles.transactionRow}>
                <div className={styles.rowElem + " dcc"}>
                    {formattedDate}
                </div>

                <div className={styles.rowElem + " dcc"}>
                    {  
                        editingTransaction[trans.id] ? 
                        <input 
                            className={styles.inputElem}
                            value={trans.particular}
                            onChange={(e) => {
                                const editedParticular = e.target.value;
                                const editedData = JSON.parse(JSON.stringify(bufferForEditingTran));
                                editedData[idx].particular = editedParticular;
                                setBufferForEditingTran(editedData);
                            }}
                            maxLength={20}
                        /> : 
                        <div>
                            {trans.particular}
                        </div>
                    }
                </div>

                <div className={styles.rowElem + " dcc"}>
                    {
                        editingTransaction[trans.id] ? 
                        <input 
                            className={styles.inputElem}
                            value={trans.debit}
                            onChange={(e) => {
                                if(/^\d*\.?\d*$/.test(e.target.value) || e.target.value === ""){
                                    const editedDebit = e.target.value;
                                    const editedData = JSON.parse(JSON.stringify(bufferForEditingTran));
                                    editedData[idx].debit = editedDebit;
                                    setBufferForEditingTran(editedData);
                                }
                            }}
                            maxLength={10}
                        /> : 
                        <div>
                            {trans.debit}
                        </div>
                    }
                </div>

                <div className={styles.rowElem + " dcc"}>
                    {
                        editingTransaction[trans.id] ? 
                        <input 
                            className={styles.inputElem}
                            value={trans.credit}
                            onChange={(e)=>{
                                if(/^\d*\.?\d*$/.test(e.target.value) || e.target.value === ""){
                                    const editedCredit = e.target.value;
                                    const editedData = JSON.parse(JSON.stringify(bufferForEditingTran));
                                    editedData[idx].credit = editedCredit;
                                    setBufferForEditingTran(editedData);
                                }
                            }}
                            maxLength={10}
                        /> : 
                        <div>{trans.credit}</div>
                    // (trans.credit)
                    }
                </div>

                <div className={styles.rowElem + " dcc"}>
                    {
                    editingTransaction[trans.id] ? 
                    <select 
                        className={`${styles.inputElem} dcc`}
                        value={trans.affectedPartition}
                        onChange={(e)=>{
                            const editedIncomePartition = e.target.value;
                            const editedData = JSON.parse(JSON.stringify(bufferForEditingTran));
                            editedData[idx].affectedPartition = editedIncomePartition
                            setBufferForEditingTran(editedData);
                        }}
                    >
                        {incomePartition.map((partitionName, idx) => {
                            return (
                                <option key={idx} value={partitionName}>
                                    {partitionName}
                                </option>
                            )
                        })}
                    </select>
                    :
                    <div>{trans.affectedPartition}</div>
                    // trans.affectedPartition
                    }
                </div>

                <div className={styles.rowElem} style={{display:"flex", justifyContent:"space-evenly", alignItems:"center"}}>
                    {
                        !editingTransaction[trans.id] ? 
                        <button style={{width:"50%", height:"50%"}} className={`${styles.createNewPartition} dcc`} onClick={()=>{handleEdit(trans.id)}}>
                            Edit
                        </button>
                        : 
                        <div>
                            <button style={{width:"80%", height:"50%"}} className={`${styles.createNewPartition} dcc`} onClick={()=>{handleSave(trans.id)}}>Save</button>
                            <button style={{width:"80%", height:"50%"}} className={`${styles.createNewPartition} dcc`} onClick={()=>{handleCancel(trans.id, idx)}}>
                                Cancel
                            </button>  
                        </div>
                        
                    }
                </div>

                <div className={styles.rowElem + " dcc"} style={{boxSizing:"border-box"}}>
                    <button style={{width:"50%", height:"50%"}} className={`${styles.createNewPartition} dcc`} onClick={()=>{handleDelete(trans.id)}}>Del</button>
                </div>
              
            </div>
        )
        
    })

    return(
        <div style={{backgroundColor:"aliceblue"}}>
            {data}
        </div>
    )
}

function InsertNewTransaction({newTransaction, setNewTransaction, incomePartition}) {
    const month = [
        "Jan", "Feb", 'Mar',
        "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", 
        "Oct", "Nov", "Dec"
    ];

    useEffect(()=>{
        const initializeNewTransaction = async () => {
            // console.log(newTransaction);
            let initNewTransactionRow =  [...newTransaction];
            console.log(initNewTransactionRow);
            initNewTransactionRow.forEach(rowData => {
                if(incomePartition.length === 0){
                    alert('Failed to retrieve income partition for current month.');
                    return;
                }
                rowData.affectedPartition = incomePartition[0];
            })

            setNewTransaction(initNewTransactionRow);
        }

        initializeNewTransaction();
    },[newTransaction.length]);

    function handleAffectedPartChange(e, index){
        // console.log(incomePartition);
        // console.log(e.target.value);
        const newPartitionName = e.target.value;
        let newTrans = [...newTransaction];
        newTrans[index].affectedPartition = newPartitionName;
        setNewTransaction(newTrans);
    }

    let currentNewTrans = newTransaction.map((elem, idx) => {
        let dateLastStr = String(elem.date.getDate()).slice(-1);
        let dateSuffix = "";

        switch(dateLastStr){
            case "1": 
                dateSuffix = "st";
                break;
            case "2": 
                dateSuffix = "nd";
                break;
            case "3":
                dateSuffix = "rd";
                break;
            default:
                dateSuffix = "th"
                break;
        }

        let date = `${
            elem.date.getDate() + 
            dateSuffix + " " +
            (month[elem.date.getMonth()])
        }`;

        return(
            <div key={idx} className={styles.transactionRow}>
                <div className={styles.rowElem + " dcc"}>{date}</div>

                <div className={styles.rowElem + " dcc"}>
                    <input
                        className={styles.inputElem}
                        value={elem.particular}
                        maxLength={20}
                        onChange={(e)=>{
                            const newTrans = [...newTransaction]; 
                            newTrans[idx].particular = e.target.value;
                            setNewTransaction(newTrans);
                        }}                        
                    />
                </div>

                <div className={styles.rowElem + " dcc"} >
                    <input
                        className={styles.inputElem}
                        value={elem.debit}
                        maxLength={10}
                        onChange={(e)=>{
                            if(/^\d+(\.\d{1,2})?$/.test(e.target.value) || e.target.value === ""){
                                const newTrans = [...newTransaction];
                                newTrans[idx].debit = e.target.value;
                                setNewTransaction(newTrans);
                            }
                            
                        }}
                    />
                </div>
                
                <div className={styles.rowElem + " dcc"}>
                    <input
                        className={styles.inputElem}
                        value={elem.credit}
                        maxLength={10}
                        onChange={(e)=>{
                            if(/^\d+(\.\d{1,2})?$/.test(e.target.value) || e.target.value === ""){
                                const newTrans = [...newTransaction];
                                newTrans[idx].credit = e.target.value;
                                setNewTransaction(newTrans);
                            }
                        }}
                    />
                </div>

                <div className={styles.rowElem + " dcc"}>
                    <select 
                        className={styles.inputElem} 
                        onChange={(e) => {handleAffectedPartChange(e, idx)}}
                    >
                        {incomePartition.map((partitionName,index) => {
                            return(
                                <option key={index} value={partitionName}>{partitionName}</option>
                            )
                        })}
                    </select>
                </div>
                <div className={styles.rowElem + " dcc "}>
                </div>

                <div className={styles.rowElem + " dcc "}>
                    <button className={`${styles.createNewPartition} dcc`}
                        style={{width:"80%", height:"50%"}} 
                        onClick={(ddd)=>{
                        setNewTransaction(newTransaction.filter((_, index) => idx !== index));
                    }}>Del(New)
                    </button>
                </div>
            </div>
        )
    });

    return(
        <div style={{backgroundColor:"aliceblue"}}>
            {currentNewTrans}
        </div>
    )
}