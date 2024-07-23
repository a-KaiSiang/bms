import React, {useEffect, useState} from "react"
import DatePicker from "react-datepicker"
import { getTransaction } from "../Api";


import styles from "../css/Transaction.module.css"
import "react-datepicker/dist/react-datepicker.css";


export default function Transaction(){
    const [startDate, setStartDate] = useState(new Date());
    const [newTransaction, setNewTransaction] = useState([]);
    const [currentTransaction, setCurrentTransaction] = useState([]);

    useEffect(() => {

        const getTransactionData = async()=>{
            try{
                const data = await getTransaction(startDate.getMonth()+1, startDate.getFullYear());
                setCurrentTransaction(data);
    
            }catch(error) {
                console.error('Error fetching transactions', error);
    
            }
        }
        getTransactionData();
    }, [startDate.getMonth(), startDate.getFullYear()])

    function handleClick(){
        setNewTransaction([...newTransaction, {date:startDate, particular:"", debit:"", credit:"", affectedPartition:""}]);
    }

    function handleSubmit(){
        
    }

    return (
        <div className="partitionContainer">
            <h1 style={{paddingLeft : "20px", margin: "25px 20px"}}>Transaction</h1>
            <hr></hr>

            <div style={{display:"flex", justifyContent: "space-between",margin: "5px",height: "50px"}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"baseline",justifyContent:"center"}}>
                    <DatePicker 
                        selected={startDate} 
                        onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy"
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

            <div className={styles.transactionTable}>
                <div className={styles.transactionHeader}>
                    <div className={styles.headerElem + " dcc"}>Date</div>
                    <div className={styles.headerElem + " dcc"}>Particular</div>
                    <div className={styles.headerElem + " dcc"}>Debit</div>
                    <div className={styles.headerElem + " dcc"}>Credit</div>
                    <div className={styles.headerElem + " dcc"}>Affected Partition</div>
                    <div className={styles.headerElem + " dcc"}></div>
                </div>

                <div className={styles.scrollContainer} style={{maxHeight: "300px", overflowY:"scroll", overflowX:"hidden"}}>
                    <TransactionRow currentTransaction={currentTransaction}/>
                    <InsertNewTransaction newTransaction={newTransaction} setNewTransaction={setNewTransaction} />
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
        <>
            {data}
        </>
    )
}

function InsertNewTransaction({newTransaction, setNewTransaction}) {
    const month = [
        "Jan", "Feb", 'Mar',
        "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", 
        "Oct", "Nov", "Dec"
    ]

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
            (month[elem.date.getMonth() + 1])
        }`;

        return(
            <div key={idx} className={styles.transactionRow}>
                <div className={styles.rowElem + " dcc"}>{date}</div>

                <div className={styles.rowElem + " dcc"}>
                    <input
                        className={styles.inputElem}
                        value={elem.particular}
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
                        onChange={(e)=>{
                            const newTrans = [...newTransaction];
                            newTrans[idx].debit = e.target.value;
                            setNewTransaction(newTrans);
                        }}
                    />
                </div>
                
                <div className={styles.rowElem + " dcc"}>
                    <input
                        className={styles.inputElem}
                        value={elem.credit}
                        onChange={(e)=>{
                            const newTrans = [...newTransaction];
                            newTrans[idx].credit = e.target.value;
                            setNewTransaction(newTrans);
                        }}
                    />
                </div>

                <div className={styles.rowElem + " dcc"}>
                    <select className={styles.inputElem}>
                        <option>Partitions should be retrieved from database.</option>
                        <option>Bank</option>
                        <option>Touch n Go</option>
                        <option>Cash</option>
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
        <div>
            {currentNewTrans}
        </div>
    )
}