import React, {useEffect, useState} from "react"
import DatePicker from "react-datepicker"
import { getTransaction, getIncomePartition, addNewTransaction } from "../Api";

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
                alert(error.errMsg);
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
                    <div className={`${styles.headerElem} dcc`} style={{backgroundColor:"#F5DEB3"}}>Affected Partition</div>
                    <div className={`${styles.headerElem} dcc`} style={{backgroundColor:"#F5DEB3"}}></div>
                </div>

                <div className={styles.scrollContainer} style={{maxHeight: "300px", overflowY:"scroll", overflowX:"hidden"}}>
                    <TransactionRow currentTransaction={currentTransaction}/>
                    <InsertNewTransaction newTransaction={newTransaction} setNewTransaction={setNewTransaction} incomePartition={incomePartition}/>
                </div>
            </div>
            {newTransaction.length > 0 && <div className="confirmNewTransaction"><button style={{width:"30%"}} onClick={handleSubmit}>Confirm</button></div>}
        </div>
    )
}

function TransactionRow({currentTransaction}) {
    if(!currentTransaction){
        return;
    }

    const data = currentTransaction.map((trans) => {
        const date = new Date(`${trans.createdDate}`);

        const formattedDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`

        return(
            <div key={trans.id} className={styles.transactionRow}>
                <div className={styles.rowElem + " dcc"}>{formattedDate}</div>
                <div className={styles.rowElem + " dcc"}>{trans.particular}</div>
                <div className={styles.rowElem + " dcc"}>{(trans.amount) < 0 ? -(trans.amount) : "0"}</div>
                <div className={styles.rowElem + " dcc"}>{(trans.amount) > 0 ? trans.amount : "0"}</div>
                <div className={styles.rowElem + " dcc"}>{trans.affectedPartition}</div>
                <div className={styles.rowElem + " dcc "}>
                    <button className={styles.createNewPartition }>Edit Transaction</button>
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
                    <button className={styles.createNewPartition} onClick={(ddd)=>{
                        setNewTransaction(newTransaction.filter((_, index) => idx !== index));
                    }}>deleteRow
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