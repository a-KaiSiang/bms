import React, {useState, useEffect} from "react";

export default function CreateUser(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleInput(e, elem){
        const {value} = e.target;
        const pattern = /^[^';\-\"]*$/;
        if(pattern.test(value)){
            switch(elem){
                case "username":
                    setUsername(value);
                    break;

                case "password":
                    setPassword(value);
                    break;
            }
        }
    }

    async function handleCreate(){

    }

    return(
        <div style={{boxSizing:"border-box", width:"100%", height:"100%", border:"1px solid black", minWidth:"872px"}}>
            <div 
                style={{
                    boxSizing:"border-box", width:"100%", height:"10%", color:"whitesmoke", display:"flex", alignItems:"center",
                    fontSize:"2.4rem", padding:"12px", margin:"10px 0 10px 0", fontWeight:"600"
                }}
            >
                Create User
            </div>

            <div 
                style={{
                    boxSizing:"border-box",width:"100%", height:"80%", border:"1px solid black", display:"flex",
                    flexDirection:"column",justifyContent:"center", alignItems:"center", background:"#f5deb3"
                }}
            >

                <div style={{boxSizing:"border-box", width:"100%", height:"50%", display:"flex", flexDirection:"column", alignItems:"center"}}>
                    <div style={{width:"100%", height:"20%", border:"1px solid black"}}>
                        
                    </div>

                    <div style={{width:"100%", height:"20%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                        <div className="dcc" style={{width:"20%",height:"100%", fontSize:"24px"}}>Username</div>
                        <div className="dcc" style={{width:"20%",height:"100%"}}>
                            <input 
                                style={{width:"100%", height:"40%", fontSize:"20px"}}
                                value={username}
                                onChange={(e)=>{handleInput(e, "username")}}
                            />
                        </div>
                    </div>

                    <div style={{width:"100%", height:"20%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                        <div className="dcc" style={{width:"20%", height:"100%", fontSize:"24px"}}>Password</div>
                        <div className="dcc" style={{width:"20%", height:"100%"}}>
                            <input 
                                style={{width:"100%", height:"40%", fontSize:"20px"}}
                                type="password"
                                value={password}
                                onChange={(e)=>{handleInput(e, "password")}}
                            />
                        </div>
                    </div>

                    <div className="dcc" style={{width:"50%", height:"20%"}}>
                        <button className="commonBut" onClick={handleCreate}>Create</button>
                    </div>
                </div>


                

            </div>
        </div>
    )
}