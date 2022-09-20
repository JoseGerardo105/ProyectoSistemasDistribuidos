const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
var app = express();

app.use(bodyParser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'university'
});

mysqlConnection.connect((err)=>{
    if(!err)
    console.log('DB connection succeded');
    else
    console.log('DB connection failed \n Error: '+JSON.stringify(err,undefined,2));
});

app.listen(3000,()=>console.log('Express server is running at port no : 3000'));
//app.get('/employees',(res,req)={

//})

hola