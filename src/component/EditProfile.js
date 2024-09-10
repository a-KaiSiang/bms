import React, {useState, useEffect} from "react";
import JSEncrypt from "jsencrypt";
import { getPubKey, validateUser, userEditProfile } from "../Api";
import { useDispatch } from "react-redux";
import { clearLoginState } from "../app/userSlice";
import { useNavigate } from "react-router-dom";

export default function EditProfile(){
    const [isUser, setIsUser] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newUserName, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordReenter, setNewPasswordReenter] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(()=>{
        // An user can try at most 2 times on password validation.
    }, [])

    async function validateCurrentUser(){
        if(!oldPassword && !isUser){
            alert("Old password should be entered and checked first.");
            return;
        }
        
        // Send user credentials to login API to check whether user is exactly the account owner.
        const currentUser = localStorage.getItem('u');
        const currentUserToken = localStorage.getItem('t');
        
        const credentials = {
            u : currentUser, 
            p : oldPassword,
            t : currentUserToken
        }
        const encryptor = new JSEncrypt();
        const pubKey = await getPubKey();
        // console.log(encryptor.getPublicKey());
        encryptor.setPublicKey(pubKey);
        let enc_credentails = encryptor.encrypt(JSON.stringify(credentials));

        const resultValidateUser = await validateUser(enc_credentails);

        if(Object.keys(resultValidateUser).includes('errMsg') || !Object.keys(resultValidateUser).includes('msg')){
            let validationApproach = localStorage.getItem('validation');

            // When validation approaches completely fail, immediately log out.
            if(validationApproach > 0){
                localStorage.setItem('validation', validationApproach-1);
                alert(`Validation fail, ${validationApproach} approaches left.`);
                return;
            } else {
                dispatch(clearLoginState());
                localStorage.clear();
                navigate('/');
                return;
            }
        }

        // enable user to modify its profile.
        alert(resultValidateUser.msg);
        setIsUser(true);
    }

    async function editUserProfile(){
        if(newUserName === '' && newPassword === '' && newPasswordReenter === ''){
            alert('Oii, dont you want to edit the profile??');
            return;
        }

        if(newPassword !== newPasswordReenter ){
            alert('New passwords do not matched.');
            return;
        }

        const newUserProfile = {
            nu : newUserName === '' ? '' : newUserName,
            np : newPassword === '' ? '' : newPassword, 
            u : localStorage.getItem('u'),
        }

        // console.log(newUserProfile);
        const encryptor = new JSEncrypt();
        const pubKey = await getPubKey();
        encryptor.setPublicKey(pubKey);
        const encryptedUserProfile = encryptor.encrypt(JSON.stringify(newUserProfile));

        const resultEditProfile = await userEditProfile(encryptedUserProfile);

        if(Object.keys(resultEditProfile).includes('errMsg') || !Object.keys(resultEditProfile).includes('msg')){
            alert(resultEditProfile.errMsg);
            return;
        }

        alert(resultEditProfile.msg);
        RefreshPage();
    }

    async function RefreshPage(){
        setIsUser(false);
        setOldPassword('');
        setNewUsername('');
        setNewPassword('');
        setNewPasswordReenter('');
        localStorage.setItem('validation', 2);
    }

    return(
        <div style={{boxSizing:"border-box", width:"100%", height:"100%", border:"1px solid #AAA"}}>
            <div 
                style={{
                    width:"100%", height:"13%", fontSize:"2.3rem", fontWeight:"600", color:"whitesmoke",
                    display:"flex", alignItems:"center", paddingLeft:"30px"
                }}
            >
                User Profile
            </div>

            <div 
                style={{
                    width:"100%", height:"67%", border:"1px solid #fff", boxSizing:"border-box",
                    display:"flex", alignItems:"center", flexDirection:"column"
                }}
            >
                {/* Check user identity. If validation fail, lock the user. Hint : Use localStorage to store left trying approach. An individual can try at most 2 times. */}
                <div style={{width:"100%", height:"30%", border:"1px solid #fff", boxSizing:"border-box", display:"flex", flexDirection:"column", justifyContent:"center"}}>
                    <div style={{width:"100%", height:"30%", display: !isUser ? "flex" : "none", justifyContent:"center", }}>
                        <div style={{margin:"10px", height:"50%", color:"whitesmoke"}}>Old Password</div>
                        <input 
                            style={{margin:"10px", height:"50%"}}
                            type="password"
                            value={oldPassword}
                            onChange={(e) => {setOldPassword(e.target.value)}}
                        />
                    </div>

                    {/* <div style={{width:"100%",  height:"30%", display:"flex", justifyContent:"center"}}>
                        <div style={{margin:"10px", height:"50%", color:"whitesmoke"}}>Re-enter Old Password</div>
                        <input 
                            style={{margin:"10px", height:"50%"}}
                        />
                    </div> */}

                    <div style={{width:"100%", height:"30%", display: !isUser ? "flex" : "none", justifyContent:"center", alignItems:"center"}}>
                        <button style={{width:"20%"}} className="commonBut" onClick={validateCurrentUser}>Check</button>
                    </div>
                </div>

                {/* Once user is identified as who it suppose to be, enable user to change its username and password. */}
                {
                    isUser && <div style={{width:"100%", height:"70%", border:"2px solid #00fcbd", boxSizing:"border-box", display:"flex", flexDirection:"column", justifyContent:"center"}}>
                        <div style={{width:"100%", height:"20%",display:"flex", justifyContent:"center", alignItems:"center"}}>
                            <div style={{margin:"10px", height:"40%", color:"whitesmoke"}}>New Username</div>
                            <input 
                                style={{margin:"10px", height:"40%"}}
                                value={newUserName}
                                onChange={(e)=>{setNewUsername(e.target.value)}}
                            />
                        </div>

                        <div style={{width:"100%", height:"20%",display:"flex", justifyContent:"center", alignItems:"center"}}>
                            <div style={{margin:"10px", height:"40%", color:"whitesmoke"}}>New Password</div>
                            <input 
                                style={{margin:"10px", height:"40%"}}
                                type="password"
                                value={newPassword}
                                onChange={(e)=>{setNewPassword(e.target.value)}}
                            />
                        </div>

                        <div style={{width:"100%", height:"20%",display:"flex", justifyContent:"center", alignItems:"center"}}>
                            <div style={{margin:"10px", height:"40%", color:"whitesmoke"}}>Re-enter new password</div>
                            <input 
                                style={{margin:"10px", height:"40%"}}
                                type="password"
                                value={newPasswordReenter}
                                onChange={(e)=>{setNewPasswordReenter(e.target.value)}}
                            />
                        </div>

                        <div style={{width:"100%", height:"13%",display:"flex", justifyContent:"center", alignItems:"center"}}>
                            <button style={{width:"20%"}} className="commonBut" onClick={() => {editUserProfile()}}>Change</button>
                        </div>
                    </div>
                }
            </div>
            
        </div>
    )

}
