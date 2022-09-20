const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
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

//Obtener todos los estudiantes
app.get('/students', (req, res) => {
    mysqlConnection.query('SELECT * FROM students', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});


//Obtener un estudiante
app.get('/students/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM students WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});


//Eliminar un estudiante
app.delete('/students/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM students WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});



//MATERIAS
app.get('/subjects/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM subjects WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

app.delete('/subjects/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM subjects WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});

app.post('/subjects/:id', (req, res) => {
    var sql = 
    mysqlConnection.query('DELETE FROM subjects WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});
