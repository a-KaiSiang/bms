import React from "react";
import styles from "../css/Page.module.css"

import IncomePartition from "../component/IncomePartition";
import Login from "../component/Login";

export default function Page(){
    const pageContainer = {
        width: '85%',
        minWidth: '860px',
        maxWidth: '1500px',
        height: '85%',
        border: '1px solid black',
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
    }

    const butNavigation = {
        width: '100%',
        height: '10%',
        border: '1px solid #faebd7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }

    return(
        <div style={pageContainer}>
            <div className={styles.navigationBar}>
                <div style={{width:"100%",height:"18%", background:"cadetBlue"}}>
                </div>
                <div style={butNavigation}>Hi</div>
                <div style={butNavigation}>Another Hi</div>
            </div>

            <div>
                
            </div>
        </div>
    )
}