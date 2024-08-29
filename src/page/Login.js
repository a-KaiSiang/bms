import React from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { loginSuccess, clearLoginState } from "../app/userSlice";
import JSEncrypt from "jsencrypt";

import { getPubKey, login } from "../Api";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    async function handleLogin(){
        try {
            if(username === ''){
                alert("Please provide username");
                return;
            }

            if(password === ''){
                alert("Please provide password");
                return;
            }

            const pubKey = await getPubKey();
            const JsEncrypt = new JSEncrypt();
            JsEncrypt.setPublicKey(pubKey);
            // console.log(pubKey);
            const encryUsername = JsEncrypt.encrypt(username);
            const encryPassword = JsEncrypt.encrypt(password);
            console.log(encryUsername);

            const userData = await login(encryUsername, encryPassword);

            if(userData.msg === "Login Success"){
                const loginAt = Date.now();
                dispatch(loginSuccess({u:userData.u, t:userData.t}));
                sessionStorage.setItem("loginSuccess", true);
                sessionStorage.setItem("u", userData.u);
                sessionStorage.setItem("t", userData.t);
                sessionStorage.setItem("ts", loginAt);
            }

        } catch (error) {
            console.error(error);
            dispatch(clearLoginState());
            alert("Login fail");
        }
    }

    return(
        <Container fluid>
            <div style={{height:"100vh", boxSizing:"border-box", backgroundColor: "#f2d480"}} className="dcc">
                <div style={{width:"40%", height:"50%", border:"2px solid black", backgroundColor:"#f7bc57", boxShadow:"0 10px 30px #ba9556, 0 20px 30px #ba9556", borderRadius:"8px"}} className="dcc">

                    <div style={{width:"100%", height:"65%", dispaly:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                        <div style ={{width:"100%", height:"10%", boxSizing:"border-box", fontSize:"25px", fontWeight:"600"}} className="dcc">
                            Budget Management System
                        </div>

                        <div style={{height:"10%"}}></div>

                        <div style={{width:"100%", height:"20%", boxSizing:"border-box"}} className="dcc">
                            <input 
                                placeholder="Please enter your username" 
                                style={{width:"50%", height:"100%", boxSizing:"border-box", margin:"10px"}} 
                                className="commonInput"
                                value={username}
                                onChange={(e)=>{setUsername(e.target.value);}}
                            />
                        </div>

                        <div style={{height:"10%"}}></div>

                        <div style={{width:"100%", height:"20%", boxSizing:"border-box"}} className="dcc">
                            <input 
                                placeholder="Please enter your password" 
                                style={{width:"50%", height:"100%", boxSizing:"border-box", margin:"10px"}} 
                                className="commonInput" type="password"
                                value={password}
                                onChange={(e)=>{setPassword(e.target.value);}}
                            />
                        </div>

                        <div style={{height:"10%"}}></div>

                        <div className="dcc" style={{width:"100%", height:"20%", boxSizing:"border-box"}}>
                            <button className="commonBut" onClick={()=>{handleLogin()}}>Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
        
    )
}