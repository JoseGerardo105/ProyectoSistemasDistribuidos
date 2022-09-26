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

mysqlConnection.connect((err, res) => {
    console.log(mysqlConnection.state);
    if (mysqlConnection.state == 'connected')
        console.log('200 -  La conexion ha sido exitosa');
    else

        res.send('503 - servidor no disponible');
});


app.listen(3000, () => console.log('Express server is running at port no : 3000'));


app.get('/students', (req, res) => {
    mysqlConnection.query('SELECT * FROM students', (err, rows, fields) => {
        if (!err)
            if (rows == 0) {
                res.status(204).send('204 - No hay elementos para mostrar');
                } else {
                    res.send(rows);   
                }
            else
            res.status(404).send('Error 404 - El estudiante no existe');
    })
});


app.get('/students/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM students WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (rows != 0)
            res.send(rows);
        else
            res.status(404).send('Error 404: El estudiante no existe');
    })
});


app.delete('/students/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM students WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (rows.affectedRows)
        res.status(200).send('Eliminado correctamente: ');
        else
        res.status(404).send('el estudiante a eliminar no fue encontrado');
    })
});


app.post('/students', (req, res) => {
    const params = req.body
    const {id, document_number, document_type, name, surname, state} = req.body
    if(!id || !document_number || !document_type || !name || !surname || !state){
        res.status(422).send('Datos incompletos');
    } else {
        mysqlConnection.query('INSERT INTO students SET ?', params, (err, rows) => {
    
            if (!err) {
                res.status(200).send('El estudiante se ha insertado correctamente');
                
            } else {
                res.status(406).send('Error insertando, debido a que el estudiante ya existe');
            }
        })
    }
});


app.put('/students', (req, res) => {
    let student = req.body;
    var sql = "SET @id = ?;SET @document_number = ?;SET @document_type = ?;SET @name = ?;SET @surname = ?;SET @state = ?; \
    CALL StudentAddOrEdit(@id,@document_number,@document_type,@name,@surname,@state);";
    mysqlConnection.query(sql, [student.id, student.document_number, student.document_type, student.name,student.surname,student.state], (err, rows, fields) => {
        if (!err)
            res.status(201).send('201 - El usuario se ha actualizado correctamente');
         else
            res.status(422).send('422 - Hay un dato faltante');
    })
});


app.get('/subjects', (req, res) => {
    mysqlConnection.query('SELECT * FROM subjects', (err, rows, fields) => {
        if (!err)
            if (rows == 0) {
                res.status(204).send('204 - No hay elementos para mostrar');
            } else {
                res.send(rows);   
            }
        else
        res.status(404).send('404 - La asignatura no existe');
    }) 
});

app.get('/subjects/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM subjects WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (rows != 0)
            res.send(rows);
        else
            res.status(404).send('Error 404: La materia buscada no existe');
    })
});

app.delete('/subjects/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM subjects WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (rows.affectedRows)
        res.status(200).send('Eliminado correctamente: ' );
        else
        res.status(404).send('la materia a eliminar no fue encontrada');
    })
});


app.post('/subjects', (req, res) => {
    const params = req.body
    const {id,code, name, credits,quotas,state} = req.body
    if(!id || !code || !name || !credits || !quotas || !state){
        res.status(422).send('Datos incompletos');
    } else {
        mysqlConnection.query('INSERT INTO subjects SET ?', params, (err, rows) => {
        if  (!err) {
            res.status(200).send('La materia se ha insertado correctamente');
        } else {
            res.status(406).send('Error insertando, debido a que la materia ya existe');
        }
    })
    }
});

app.post('/students', (req, res) => {
    const params = req.body
    const {id, document_number, document_type, name, surname, state} = req.body
    if(!id || !document_number || !document_type || !name || !surname || !state){
        res.status(422).send('Datos incompletos');
    } else {
        mysqlConnection.query('INSERT INTO students SET ?', params, (err, rows) => {
            if (!err) {
                res.status(200).send('El estudiante se ha insertado correctamente');
                
            } else {
                res.status(406).send('Error insertando, debido a que el estudiante ya existe');
            }
        })
    }
});




app.put('/subjects', (req, res) => {
    let subject = req.body;
    var sql = "SET @id = ?;SET @code = ?;SET @name = ?;SET @credits = ?;SET @quotas = ?;SET @state = ?; \
    CALL SubjectAddOrEdit(@id,@code,@name,@credits,@quotas,@state);";
    mysqlConnection.query(sql, [subject.id, subject.code, subject.name, subject.credits, subject.quotas, subject.state], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if (element.constructor == Array)
                res.status(201).send('201 - Materia modificada exitosamente');
            });
        else
            res.status(422).send('422 - Hay un dato faltante');
    })
});