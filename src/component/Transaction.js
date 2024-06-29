import React, {useState} from "react"
import DatePicker from "react-datepicker"


import styles from "../css/Transaction.module.css"
import "react-datepicker/dist/react-datepicker.css";


export default function Transaction(){
    const [startDate, setStartDate] = useState(new Date());

    return (
        <div className="partitionContainer">
            <h1 style={{paddingLeft : "20px", margin: "25px 20px"}}>Transaction</h1>
            <hr></hr>

            <div style={{display:"flex", justifyContent: "space-between",margin: "20px",height: "50px"}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"baseline",justifyContent:"flex-end"}}>
                    Date :
                    <DatePicker 
                        selected={startDate} 
                        onChange={(date) => setStartDate(date)} dateFormat="MM/yyyy"
                    />


                </div>
                
                <button type="button" className={styles.createNewPartition}>
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
                    <TransactionRow />
                    <TransactionRow />
                    <TransactionRow />
                    <TransactionRow />
                    <TransactionRow />
                    <TransactionRow />
                    <TransactionRow />
                    <TransactionRow />
                    <TransactionRow />
                    <TransactionRow />
                </div>
            </div>

           
        </div>
    )
}

function TransactionRow() {
    return(
        <div className={styles.transactionRow}>
            <div className={styles.rowElem + " dcc"}>13rd Jun</div>
            <div className={styles.rowElem + " dcc"}>Petrol</div>
            <div className={styles.rowElem + " dcc"}>100</div>
            <div className={styles.rowElem + " dcc"}>-</div>
            <div className={styles.rowElem + " dcc"}>Bank</div>
            <div className={styles.rowElem}>
                <button className={styles.createNewPartition + " dcc "}>Edit Transaction</button>
            </div>
        </div>
    )
}