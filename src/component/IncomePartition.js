import React, {useEffect, useState} from "react"
import DatePicker from "react-datepicker"

import { IncomePartitionDataSample, getIncome } from "../Api";


import styles from "../css/IncomePartition.module.css"

export default function IncomePartition(){
    const [showInputComponent, setShowInputComponent] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentIncome, setCurrentIncome] = useState([]);

    useEffect(()=>{
        const getLast3MonthIncome = async () => {
            try{
                const month = selectedDate.getMonth() + 1;
                const year = selectedDate.getFullYear();

                const incomeLast3Month  = await getIncome(month, year);
                setCurrentIncome(incomeLast3Month);

            }catch(error){
                console.error('Error fetching income: ', error);
            }
        }

        getLast3MonthIncome();
    }, [selectedDate.getMonth(), selectedDate.getFullYear()])

    return (
        <div className="partitionContainer">
            <h1 style={{paddingLeft : "20px", margin: "25px 20px"}}>Income Partition</h1>
            <hr></hr>

            <div className="createNewContainer">
                <div className="datePickerStyle">
                    <DatePicker 
                        selected={selectedDate} 
                        onChange={(date) => setSelectedDate(date)} 
                    />
                </div>

                <button className="createNewPartition" onClick={()=>{setShowInputComponent(!showInputComponent)}}>
                    Create new Partition
                </button>  
            </div>
             

            <div style={{margin: "10px 0", width: "100%", height: "75%", maxHeight:"500px",overflowX: "hidden"}}>
                {showInputComponent && <PartitionCreation />}
                {currentIncome && <PartitionDataRow partitionInfo={currentIncome} />}
            </div>
        </div>
    )
}

function PartitionDataRow({partitionInfo}){
    const incomeRecord = partitionInfo.map(elem => {
        const date = new Date(`${elem.createdDate}`);

        const formattedDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
        return(
            <div key={elem.id} className={styles.gridTable} dategroup={formattedDate}>
                <div className={styles.name}>{elem.partitionName}</div>
                <div className={styles.distributed}>{elem.distributedAmount}</div>
                <div className={styles.balance}>{elem.distributedAmount}</div>
                <div className={styles.expenses}>{elem.distributedAmount}</div>
                <div className={styles.income}>{elem.totalIncome}</div>
            </div>
        )
    });

    // console.log(incomeRecord[0].props.dategroup);
    // console.log(incomeRecord[0]);

    let init_date = '';
    const organizedIncomeRecord = incomeRecord.map(elem => {
        if(elem.props.dategroup != init_date){
            init_date = elem.props.dategroup;
            return(
                <>
                    <hr/>
                    <PartitionHeader createdDate={init_date}/>
                    {elem}
                </>
            )
        }else{
            return(
                <>
                    {elem}
                </>
            )
        }
    });

    return(
        <>
            {organizedIncomeRecord}
        </>
    )
}

function PartitionHeader({createdDate}){
    return (
        <div className={styles.gridTable}>
            <div style={{backgroundColor:"wheat"}} className={styles.header}>
                Created at : <span>{createdDate}</span>
            </div>
            <div style={{backgroundColor:"lightgray", fontWeight: "500"}} className={styles.name}>Name</div>
            <div style={{backgroundColor:"lightgray", fontWeight: "500"}} className={styles.distributed}>Distributed</div>
            <div style={{backgroundColor:"lightgray", fontWeight: "500"}} className={styles.balance}>Balance</div>
            <div style={{backgroundColor:"lightgray", fontWeight: "500"}} className={styles.expenses}>Expenses</div>
            <div style={{backgroundColor:"lightgray", fontWeight: "500"}} className={styles.income}>Income</div>
        </div>
    )
}


function PartitionCreation(){
    const [partitionRowTemplate, setPartitionRow] = useState([]);

    const partitionDataTemplate = {name:"", distributed:"", balance:"0", expenses:"0", income:"0"}

    function addRow() {
        setPartitionRow([...partitionRowTemplate, partitionDataTemplate]);
    }

    function deleteRow(index) {
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

function NewPartitionRow({partitionInfo, deleteRow, setPartitionRow}){
    const newRow = partitionInfo.map((elem,idx) => (
        <div key={idx} className={styles.gridTable}>
            <div className={styles.name} style={{display:"flex"}}>
                <button className="butDeleteRow" onClick={() => {deleteRow(idx);}}></button>

                <input 
                    type="text" 
                    className={styles.name + " inputElem"} 
                    placeholder="PartitionName"
                    value={elem.name}
                    onChange={(e)=>{
                        const newPartitionInfo = [...partitionInfo];
                        newPartitionInfo[idx].name = e.target.value;
                        // console.log(newPartitionInfo);
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
