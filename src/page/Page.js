import React from "react";
import { Container } from "react-bootstrap";

import { Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearLoginState } from "../app/userSlice";

import styles from "../css/Page.module.css"
import IncomePartition from "../component/IncomePartition";
import Transaction from "../component/Transaction";

export default function Page({loginSession, setLoginSession}){
    const dispatch = useDispatch();

    function handleLogout(){
        dispatch(clearLoginState());
        localStorage.removeItem("loginSuccess");
        localStorage.removeItem("u");
        localStorage.removeItem("t");
        setLoginSession(false);
    }

    return(
        <Container fluid className={styles.pageContainer + " dcc"} >
            <div className={styles.mainWindow} >
                <div className={styles.navigationBar}>
                    <div className="dcc" style={{width:"100%",height:"18%",background:"wheat",borderBottom: "1px solid black"}}>
                        <span style={{fontWeight: 650, fontSize:"1.2em"}}>Budget Managament System</span>
                    </div>
                    <Link to="/IncomePartition"  className={styles.navigationButton + " dcc"}>IncomePartition</Link>
                    <Link to="/Transaction"  className={styles.navigationButton + " dcc"}>Transaction</Link>
                    <Link to="/" onClick={handleLogout} className={styles.navigationButton + " dcc"}>Log out</Link>
                </div>

                <div className={styles.mainComponent}>
                    <Routes>
                        <Route path="/" element={<IncomePartition/>}/>
                        <Route path="/IncomePartition" element={<IncomePartition/>}/>
                        <Route path="/Transaction" element={<Transaction/>}/>
                    </Routes>
                </div>
            </div>
        </Container>
    )
}