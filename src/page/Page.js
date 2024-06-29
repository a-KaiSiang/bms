import React from "react";
import { Container } from "react-bootstrap";
import styles from "../css/Page.module.css"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

import IncomePartition from "../component/IncomePartition";
import Transaction from "../component/Transaction";
import Login from "../component/Login";

export default function Page(){
    
    return(
        <Container fluid className={styles.pageContainer + " dcc"} >
            <Router>
                <div className={styles.mainWindow} >
                    <div className={styles.navigationBar}>
                        <div className="dcc" style={{width:"100%",height:"18%",background:"rgb(100,100,131)",borderBottom: "1px solid black"}}>
                            <span style={{fontWeight: 650, fontSize:"1.2em", paddingLeft: "20px"}}>Budget Managament System</span>
                        </div>
                        <Link to="/IncomePartition"  className={styles.navigationButton + " dcc"}>IncomePartition</Link>
                        <Link to="/Transaction"  className={styles.navigationButton + " dcc"}>Transaction</Link>
                    </div>

                    <div className={styles.mainComponent}>
                        
                            <Routes>
                                <Route path="/" element={<IncomePartition/>}/>
                                <Route path="/IncomePartition" element={<IncomePartition/>}/>
                                <Route path="/Transaction" element={<Transaction/>}/>
                            </Routes>

                        
                    </div>
                </div>
            </Router>
        </Container>
    )
}