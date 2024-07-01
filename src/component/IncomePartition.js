import React from "react"

import styles from "../css/IncomePartition.module.css"

export default function IncomePartition(){
    return (
        <div className="partitionContainer">
            <h1 style={{paddingLeft : "20px", margin: "25px 20px"}}>Income Partition</h1>
            <hr></hr>

            <button className={styles.createNewPartition}>
                Create new Partition
            </button>

            <div style={{margin: "10px 0"}}>
                <PartitionHeader />
                <PartitionRow />
                <PartitionRow />
                <PartitionRow />
            </div>
        </div>
    )
}

function PartitionHeader(){
    return (
        <div className={styles.gridTable}>
            <div style={{backgroundColor:"wheat"}} className={styles.header}>
                Created at : <span>27-06-2024</span>
            </div>
            <div style={{backgroundColor:"lightgray", fontWeight: "500"}} className={styles.name}>Name</div>
            <div style={{backgroundColor:"lightgray", fontWeight: "500"}} className={styles.distributed}>Distributed</div>
            <div style={{backgroundColor:"lightgray", fontWeight: "500"}} className={styles.balance}>Balance</div>
            <div style={{backgroundColor:"lightgray", fontWeight: "500"}} className={styles.expenses}>Expenses</div>
            <div style={{backgroundColor:"lightgray", fontWeight: "500"}} className={styles.income}>Income</div>
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
