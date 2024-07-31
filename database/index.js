const mysql = require('mysql2');
const mysql_promise = require('mysql2/promise');

const basicServerConfig = {
    host: "localhost", 
    user: "root",
    password: "Asadas&^%aAaccaSuN!*!@&I#!yhsA", 
    database: "mydb",
    timezone: "Z",
}

const connection = mysql.createConnection(basicServerConfig);
const pool = mysql_promise.createPool({
    ...basicServerConfig,
    connectionLimit: 10,
});

connection.connect((err)=>{
    if(err){
        console.error('Connection error.');
        return
    }

    console.log('Connection success');
})

// pool.getConnection((err, conn) =>{
//     if(err){
//         console.error("Pool connection failed.");
//         return;
//     }

//     console.log("Pool connection success");
//     conn.release();
// })

exports.connection = connection;
exports.pool = pool;