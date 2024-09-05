const {createUser} = require("../utility/sqlfunction");

async function createUserHandler(req, res){
    try{
        const newUsername = req.body.nu;
        const newPassword = req.body.np;

        if(!newUsername || !newPassword){
            res.status(401).json({errMsg : "Invalid data of new user."})
            return;
        }

        const newUserInsertResult = await createUser(newUsername, newPassword); 
        
        if(!newUserInsertResult){
            res.status(500).json({errMsg : "Something went wrong when creating new user."});
            return;
        }  

        res.status(200).json({msg : "User created."})
    }catch(error){
        console.error("sssss");
        res.status(500).json({errMsg : "Something went wrong when creating new user."});
    }
}

module.exports = createUserHandler;