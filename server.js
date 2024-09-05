const express = require('express');
const cors = require('cors');
// const url = require('url');

const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');

const {connection} = require('./database')

const app = express(); 
const port = 3030; 

const options = {
    key: fs.readFileSync('./static/key.pem'),
    cert: fs.readFileSync('./static/cert.pem')
}

//handler
const publicHandler = require('./public');
const mainHandler = require('./main');
const adminHandler = require('./admin');

//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', publicHandler);
app.use('/main', mainHandler);
app.use('/admin', adminHandler);

app.listen(port, ()=>{
    console.log('listening......');
})

https.createServer(options, app).listen(443, ()=>{
    console.log('Running https');
})

app.get('/asdasd',(req,res)=>{
    res.send('Hello HTTPS.');
})