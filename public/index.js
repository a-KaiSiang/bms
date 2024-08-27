const express = require('express')();

const loginHandler = require('./login');
const getPubKeyHandler = require('./getPubKey');

express.use((req, res, next) => {
    if(req.headers.authorization !== "asjkgasdyucvqw98x7a97egqi2wx"){
        res.status(403).json({errMsg : "Access denied"});
        return;
    }
    next();
})

express.get('/getPubKey', getPubKeyHandler);
express.post('/login', loginHandler);

module.exports = express;