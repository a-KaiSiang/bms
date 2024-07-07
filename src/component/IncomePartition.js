import React, {useState} from "react"
import DatePicker from "react-datepicker"

import { IncomePartitionDataSample } from "../Api";


import styles from "../css/IncomePartition.module.css"

export default function IncomePartition(){
    const [showInputComponent, setShowInputComponent] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
        <div className="partitionContainer">
            <h1 style={{paddingLeft : "20px", margin: "25px 20px"}}>Income Partition</h1>
            <hr></hr>

            <div className="createNewContainer">
                <div className="datePickerStyle">
                    <DatePicker 
                        selected={selectedDate} 
                        onChange={(date) => selectedDate(date)} 
                    />
                </div>

                <button className="createNewPartition">
                    Create new Partition
                </button>  
            </div>
             
            <PartitionCreation />

            <div style={{margin: "10px 0", width: "100%"}}>
                    <PartitionHeader />
                    {IncomePartitionDataSample.map((elem, index) => (
                        <PartitionDataRow key={index} partitionInfo={elem} />
                    ))}
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

function PartitionDataRow({partitionInfo}){
    return(
        <div className={styles.gridTable}>
            <div className={styles.name}>{partitionInfo.name}</div>
            <div className={styles.distributed}>{partitionInfo.distributed}</div>
            <div className={styles.balance}>{partitionInfo.balance}</div>
            <div className={styles.expenses}>{partitionInfo.expenses}</div>
            <div className={styles.income}>{partitionInfo.income}</div>
        </div>
    )
}

function NewPartitionRow({partitionInfo, deleteRow, setPartitionRow}){
    const newRow = partitionInfo.map((elem,idx) => (
        <div key={idx} className={styles.gridTable}>
            <div className={styles.name}>
                <button className="butDeleteRow" onClick={() => {deleteRow(idx);}}>X</button>
                <input 
                    type="text" 
                    className={styles.name + " inputElem"} 
                    placeholder="PartitionName"
                    value={elem.name}
                    onChange={(e)=>{
                        const newPartitionInfo = [...partitionInfo];
                        newPartitionInfo[idx].name = e.target.value;
                        console.log(newPartitionInfo);
                        setPartitionRow(newPartitionInfo);
                    }}
                />
            </div>
           
            <div className={styles.distributed}>
                <input 
                    type="text" 
                    className={styles.distributed + " inputElem"}
                    placeholder="Distributed"
                    value={elem.distributed}
                    onChange={(e)=>{
                        const newPartitionInfo = [...partitionInfo];
                        newPartitionInfo[idx].distributed = e.target.value;
                        setPartitionRow(newPartitionInfo);
                    }}
                    
                />
            </div>

            <div className={styles.balance}>
                <span>{elem.balance}</span>
            </div>

            <div className={styles.expenses}>
                <span>{elem.expenses}</span>
            </div>
            
            <div className={styles.income}>
                <span>{elem.income}</span>
            </div>
        </div>
    ))

    return(
        <>
            {newRow}
        </>
    )
}

function PartitionCreation(){
    const [partitionRowTemplate, setPartitionRow] = useState([]);

    const partitionDataTemplate = {name:"", distributed:"", balance:"0", expenses:"0", income:"0"}

    function addRow() {
        setPartitionRow([...partitionRowTemplate, partitionDataTemplate]);
    }

    function deleteRow(index) {
        // console.log(partitionRowTemplate.filter((_, idx) => idx == index));
        setPartitionRow(partitionRowTemplate.filter((_, idx) => idx != index));
    }

    return(
        <div style={{margin: "10px 0", width: "100%", display:'flex', flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
            <div style={{width:"100%"}}>
                <PartitionHeader />
            </div>
            <div style={{width:"100%", display:"flex", justifyContent:"center", flexDirection:"column"}}>
                
                <NewPartitionRow partitionInfo={partitionRowTemplate} deleteRow={deleteRow} setPartitionRow={setPartitionRow}/>

                <div style={{width: "100%"}}>
                    <div style={{ display:"flex", alignItems:"center", flexDirection:"column"}}>
                        <button style={{width: "80%"}} className="addRow" onClick={addRow}>Add row</button>
                        {partitionRowTemplate.length>0 && <button style={{margin: 0}} className="addRow">Confirm</button>}
                    </div>
                </div>
            </div>
        </div>
    )
}
