const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
var app = express();

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'university',
   multipleStatements: true
});

mysqlConnection.connect((err)=>{
    if(!err)
    console.log('DB connection succeded');
    else
    console.log('DB connection failed \n Error: '+JSON.stringify(err,undefined,2));
});

app.listen(3000,()=>console.log('Express server is running at port no : 3000'));


app.get('/students', (req, res) => {
    mysqlConnection.query('SELECT * FROM students', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});


app.get('/students/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM students WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});



app.delete('/students/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM students WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully the student whit the id : ' + element[0].id);
        else
            console.log(err);
    })
});


app.post('/students', (req, res) => {
    let student = req.body;
    var sql = "SET @id = ?;SET @document_number = ?;SET @document_type = ?;SET @name = ?;SET @surname = ?;SET @state = ?; \
    CALL StudentAddOrEdit(@id,@document_number,@document_type,@name,@surname,@state);";
    mysqlConnection.query(sql, [student.id, student.document_number, student.document_type, student.name,student.surname,student.state], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted student id : '+element[0].id);
            });
        else
            console.log(err);
    })
});


app.put('/students', (req, res) => {
    let student = req.body;
    var sql = "SET @id = ?;SET @document_number = ?;SET @document_type = ?;SET @name = ?;SET @surname = ?;SET @state = ?; \
    CALL StudentAddOrEdit(@id,@document_number,@document_type,@name,@surname,@state);";
    mysqlConnection.query(sql, [student.id, student.document_number, student.document_type, student.name,student.surname,student.state], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted student id : '+element[0].id);
            });
        else
            console.log(err);
    })
});