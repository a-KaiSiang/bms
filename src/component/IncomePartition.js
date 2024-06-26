import React from "react"

import styles from "../css/IncomePartition.module.css"


export default function IncomePartition(){
    const partitionContainer = {
        border: "1px solid black",
        width: "50%",
        height: "60%",
        position: "absolute",
        left: 100,
        top: 100,
        minWidth: 650
    }

    return (
        <div style={partitionContainer}>
            <h1 style={{paddingLeft : "20px"}}>Income Partition</h1>
            <hr></hr>

            <div>
                <PartitionTemplate />
                <PartitionRow />
            </div>
            
        </div>
    )
}

function PartitionTemplate(){
    return (
        <div className={styles.gridTable}>
            <div className={styles.header}>
                Created at : <span>27-06-2024</span>
            </div>
            <div className={styles.name}>Name</div>
            <div className={styles.distributed}>Distributed</div>
            <div className={styles.balance}>Balance</div>
            <div className={styles.expenses}>Expenses</div>
            <div className={styles.income}>Income</div>
        </div>
    )
}

function PartitionRow(){
    return(
        <div className={styles.gridTable}>
            <div className={styles.name}>Bank</div>
            <div className={styles.distributed}>1000</div>
            <div className={styles.balance}>1000</div>
            <div className={styles.expenses}>-</div>
            <div className={styles.income}>-</div>
        </div>
    )
}
