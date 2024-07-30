import React, {useEffect, useState} from "react"
import DatePicker from "react-datepicker"

import { getIncome, createNewIncomePartition } from "../Api";
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
            <h1 style={{paddingLeft : "20px", margin: "25px 20px", color:"whitesmoke"}}>Income Distribution</h1>
            <hr></hr>

            <div className="createNewContainer">
                <div className="datePickerStyle">
                    <DatePicker 
                        selected={selectedDate} 
                        onChange={(date) => setSelectedDate(date)} 
                        dateFormat={'dd-MM-yyyy'}
                    />
                </div>

                <button className="createNewPartition" onClick={()=>{setShowInputComponent(!showInputComponent)}}>
                    Create new Partition
                </button>  
            </div>
             

            <div style={{margin: "10px 0", width: "100%", height: "75%", maxHeight:"500px",overflowX: "hidden"}}>
                {showInputComponent && <PartitionCreation selectedDate={selectedDate}/>}
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
                <div className={styles.expenses}>{elem.distributedAmount}</div>
                <div className={styles.income}>{elem.totalIncome}</div>
                <div className={styles.balance}>{elem.distributedAmount}</div>

            </div>
        )
    });

    // console.log(incomeRecord[0].props.dategroup);
    // console.log(incomeRecord[0]);

    let init_date = '';
    const organizedIncomeRecord = incomeRecord.map((elem, idx) => {
        if(elem.props.dategroup !== init_date){
            init_date = elem.props.dategroup;
            return(
                <div key={idx}>
                    <hr/>
                    <PartitionHeader createdDate={init_date}/>
                    {elem}
                </div>
            )
        }else{
            return(
                <div key={idx}>
                    {elem}
                </div>
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
            <div style={{backgroundColor:"lightgray", fontWeight: "500"}} className={styles.distributed}>Initial Distributed</div>
            <div style={{backgroundColor:"lightgray", fontWeight: "500"}} className={styles.expenses}>Total Expenses</div>
            <div style={{backgroundColor:"lightgray", fontWeight: "500"}} className={styles.income}>Total Income</div>
            <div style={{backgroundColor:"lightgray", fontWeight: "500"}} className={styles.balance}>Balance</div>

        </div>
    )
}


function PartitionCreation({selectedDate}){
    const [partitionRow, setPartitionRow] = useState([]);

    const partitionDataTemplate = {name:"", distributed:"", totalExpenses:"-", totalIncome:"-" ,balance:"-"};
    const formattedDate = `${selectedDate.getDate()}-${selectedDate.getMonth()+1}-${selectedDate.getFullYear()}`;

    function addRow() {
        setPartitionRow([...partitionRow, partitionDataTemplate]);
    }

    function deleteRow(index) {
        setPartitionRow(partitionRow.filter((_, idx) => idx !== index));
    }

    async function handleSubmit(){
        try {
            // Validate name. (length should greater than 2)
            const failCase_AllPartitionName = partitionRow.filter(elem => elem.name === '');
            // Validate distributed amount. (should be able to parse to float)
            const failCase_AllDistributed = partitionRow.filter(elem => isNaN(parseFloat(elem.distributed)));

            if(failCase_AllPartitionName.length > 0){
                alert("Invalid input on partition name");
                return;
            }else if(failCase_AllDistributed.length > 0){
                alert("Invalid input on distributed amount");
                return;
            }
            // validate whether total of distributed is tally with income.
            const totalOfDistributed = partitionRow.reduce((total, current)=>(total + parseFloat(current.distributed)), 0);

            // call API to fetch request to /addIncomeTransaction.
            await createNewIncomePartition(selectedDate, {partitionRow: partitionRow});
        } catch (error) {
            console.error(error);
            alert(error);
            return;
        }
    }

    return(
        <div style={{margin: "10px 0", width: "100%", display:'flex', flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
            <div style={{width:"100%"}}>
                <PartitionHeader createdDate={formattedDate}/>
            </div>
            <div style={{width:"100%", display:"flex", justifyContent:"center", flexDirection:"column"}}>
                
                <NewPartitionRow partitionInfo={partitionRow} deleteRow={deleteRow} setPartitionRow={setPartitionRow}/*income={income} setIncome={setIncome}*//>

                <div style={{width: "100%"}}>
                    <div style={{ display:"flex", alignItems:"center", flexDirection:"column"}}>
                        <button style={{width: "80%"}} className="addRow" onClick={addRow}>Add row</button>
                        {partitionRow.length>0 && <button style={{margin: 0}} className="addRow" onClick={handleSubmit}>Confirm</button>}
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
                    maxLength={10}
                    onChange={(e)=>{
                        const {value} = e.target;
                        const newPartitionInfo = [...partitionInfo];
                        newPartitionInfo[idx].name = value;
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
                    maxLength={10}
                    onChange={(e)=>{
                        const {value} = e.target;
                        if(/^\d*\.?\d*$/.test(value) || value === ''){
                            const newPartitionInfo = [...partitionInfo];
                            newPartitionInfo[idx].distributed = value;
                            setPartitionRow(newPartitionInfo);
                        }
                    }}
                />
            </div>


            <div className={styles.expenses}>
                <span>{elem.totalExpenses}</span>
            </div>
            
            <div className={styles.income}>
                {/* <input
                    type="text"
                    className={`${styles.income} inputElem`}
                    placeholder="Total Income"
                    value={income}
                    maxLength={10}
                    onChange={(e)=>{
                        const {value} = e.target;
                        if(/^\d*\.?\d*$/.test(value) || value === ''){
                            // const newPartitionInfo = [...partitionInfo];
                            // newPartitionInfo[idx].income = e.target.value;
                            setIncome(value);
                        }
                    }}
                /> */}
                -
            </div>
            
            <div className={styles.balance}>
                <span>{elem.balance}</span>
            </div>
        </div>
    ))

    return(
        <div>
            {newRow}
        </div>
    )
}
