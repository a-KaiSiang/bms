const express = require('express');
const cors = require('cors');
// const url = require('url');
const bodyParser = require('body-parser');
const {connection} = require('./database')

const app = express(); 
const port = 3030; 

const mainHandler = require('./main');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/main', mainHandler);

app.get('/getTransaction', (req, res)=>{
    let month = req.query.m; 
    let year = req.query.y;

    let query = `SELECT * FROM transactions WHERE MONTH(createdDate) = ${month} AND YEAR(createdDate) = ${year}`;

    connection.query(query, (err, results) => {
        if(err){
            console.error('Error executing query:', err.stack);
            return res.status(500).json({error:"Query error"});
        }

        res.json(results);
    });
});

app.post('/editTransaction', (req, res)=>{

});

app.post('/editPartition', (req, res)=>{

});

app.listen(port, ()=>{
    console.log('listening......');
})