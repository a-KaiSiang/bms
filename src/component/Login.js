import React, { useState } from "react";

import '../css/Login.css';

export default function Login(){
    //style
    const inputField = {
        'display' : 'flex',
    }

    const inputHeight = {
        'height' : '2em'
    }

    //state
    const [userCredential, setUserCredential] = useState({
        username : '',
        password : ''
    });

    function handleSubmit(){
        if(userCredential.username === "" || userCredential === ""){
            console.error('Provides your credentials!!!');
            return;
        }

        console.log(userCredential);
    }

    return(
        <div className="login_page">
            <h2 className="header">Budget App Managemenet</h2>

            <div style={inputField}>
                <div className="input_elems input_label">
                    <label htmlFor='username'>Username  <br></br></label>
                    <label htmlFor='password'>Password  </label>
                </div>
                
                <div className="input_elems"> 
                    <input id='username' size="40" style={inputHeight} value={userCredential.username} 
                    onChange={e=>{
                        setUserCredential({
                            ...userCredential,
                            username:e.target.value
                        })
                    }}>

                    </input>
                    <input id='password' size="40" style={inputHeight} value={userCredential.password} 
                    onChange={e=>{
                        setUserCredential({
                            ...userCredential,
                            password:e.target.value
                        })
                    }}>

                    </input>
                </div>
               
            </div>

            <button type="submit" className="button-81" onClick={()=>handleSubmit()}>Login</button>
        </div>
    )
}