/**
const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
var app = express();

app.use(bodyparser.json());

var myDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'university',
    multipleStatements: true
});

myDB.connect((err, res) => {
    console.log(myDB.state);
    if (myDB.state == 'connected')
        console.log('200 -  La conexion ha sido exitosa');
    else

        res.send('503 - servidor no disponible');
});


app.listen(3000, () => console.log('Express server is running at port no : 3000'));


app.get('/students', (req, res) => {
    myDB.query('SELECT * FROM students', (err, rows, fields) => {
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
    myDB.query('SELECT * FROM students WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (rows != 0)
            res.send(rows);
        else
            res.status(404).send('Error 404: El estudiante no existe');
    })
});


app.delete('/students/:id', (req, res) => {
    myDB.query('DELETE FROM students WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (rows.affectedRows)
            res.status(200).send('Eliminado correctamente: ');
        else
            res.status(404).send('el estudiante a eliminar no fue encontrado');
    })
});


app.post('/students', (req, res) => {
    const params = req.body
    const { id, document_number, document_type, name, surname, state } = req.body
    if (!id || !document_number || !document_type || !name || !surname || !state) {
        res.status(422).send('Datos incompletos');
    } else {
        myDB.query('INSERT INTO students SET ?', params, (err, rows) => {

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
    myDB.query(sql, [student.id, student.document_number, student.document_type, student.name, student.surname, student.state], (err, rows, fields) => {
        if (!err)
            res.status(201).send('201 - El usuario se ha actualizado correctamente');
        else
            res.status(422).send('422 - Hay un dato faltante');
    })
});


app.get('/subjects', (req, res) => {
    myDB.query('SELECT * FROM subjects', (err, rows, fields) => {
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
    myDB.query('SELECT * FROM subjects WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (rows != 0)
            res.send(rows);
        else
            res.status(404).send('Error 404: La materia buscada no existe');
    })
});

app.delete('/subjects/:id', (req, res) => {
    myDB.query('DELETE FROM subjects WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (rows.affectedRows)
            res.status(200).send('Eliminado correctamente: ');
        else
            res.status(404).send('la materia a eliminar no fue encontrada');
    })
});


app.post('/subjects', (req, res) => {
    const params = req.body
    const { id, code, name, credits, quotas, state } = req.body
    if (!id || !code || !name || !credits || !quotas || !state) {
        res.status(422).send('Datos incompletos');
    } else {
        myDB.query('INSERT INTO subjects SET ?', params, (err, rows) => {
            if (!err) {
                res.status(200).send('La materia se ha insertado correctamente');
            } else {
                res.status(406).send('Error insertando, debido a que la materia ya existe');
            }
        })
    }
});

app.put('/subjects', (req, res) => {
    let subject = req.body;
    var sql = "SET @id = ?;SET @code = ?;SET @name = ?;SET @credits = ?;SET @quotas = ?;SET @state = ?; \
    CALL SubjectAddOrEdit(@id,@code,@name,@credits,@quotas,@state);";
    myDB.query(sql, [subject.id, subject.code, subject.name, subject.credits, subject.quotas, subject.state], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if (element.constructor == Array)
                    res.status(201).send('201 - Materia modificada exitosamente');
            });
        else
            res.status(422).send('422 - Hay un dato faltante');
    })
});

app.get('/inscription', (req, res) => {
    myDB.query('SELECT * FROM inscription', (err, rows, fields) => {
        if (!err)
            if (rows == 0) {
                res.status(204).send('No hay elementos para mostrar');
            } else {
                res.send(rows);
            }
        else
            res.status(404).send('La inscripcion no existe');
    })
});


app.get('/inscription/:id', (req, res) => {
    myDB.query('SELECT * FROM inscription WHERE id_student = ?', [req.params.id], (err, rows, fields) => {
        if (rows != 0)
            res.send(rows);
        else
            res.status(404).send('La inscripcion no existe');
    })
});


app.delete('/inscription/:id', (req, res) => {
    myDB.query('DELETE FROM inscription WHERE id_student = ?', [req.params.id], (err, rows, fields) => {
        if (rows.affectedRows)
            res.status(200).send('Eliminado correctamente ');
        else
            res.status(404).send('La inscripcion a eliminar no fue encontrada');
    })
});


app.post('/inscription', (req, res) => {
    const params = req.body
    myDB.query('INSERT INTO inscription SET ?', params, (err, rows) => {
        if (err) {
            res.status(422).send('422 - Hay un dato faltante');
        } else {
            res.status(201).send('201 - Inscripcion insertada exitosamente');
        }
    })
});

app.put('/inscription', (req, res) => {
    let student = req.body;
    var sql = "SET @id_student = ?;SET @id_subject = ?;SET @registrationDate = ?; \
    CALL InscriptionAddOrEdit(@id_student,@id_subject,@registrationDate);";
    myDB.query(sql, [inscription.id_student, inscription.id_subject, inscription.registrationDate], (err, rows, fields) => {
        if (!err)
            res.status(201).send('La inscripcion se ha actualizado correctamente');
        else
            res.status(422).send('Hay un dato faltante');
    })
});

*/