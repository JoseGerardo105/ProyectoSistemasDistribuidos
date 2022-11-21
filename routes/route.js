const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const express = require('express')
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client')
const { BlobServiceClient } = require('@azure/storage-blob');
const { config } = require("dotenv");
config();
const multer = require("multer");
const prisma = new PrismaClient()
const upload = multer()
const blobService = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const authController = require('../controllers/authController')
const responseTime = require("response-time")
router.use(responseTime())
const redis = require("redis");
const { promisify } = require('util')
const redisClient = redis.createClient({
    host: 'distri.redis.cache.windows.net',
    port: 6379,
    legacyMode: true
})
redisClient.connect()
const GET_ASYNC = promisify(redisClient.get).bind(redisClient)
const SET_ASYNC = promisify(redisClient.set).bind(redisClient)


router.get('/', authController.isAuthenticated, (req, res) => {
    res.render('index', { user: req.user })
})
router.get('/login', (req, res) => {
    res.render('login', { alert: false })
})
router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)


/**
 * @swagger
 * components:
 *  schemas:
 *    Students:
 *      type: object
 *      properties:
 *        id:
 *              type: integer
 *        document_number:
 *              type: string           
 *        document_type:
 *              type: string
 *        name:
 *              type: string           
 *        surname:
 *              type: string           
 *        state:
 *              type: string
 *      required:
 *        - id
 *        - document_number
 *        - document_type
 *        - name
 *        - surname
 *        - state
 *     
 *    subjects:
 *      type: object
 *      properties:
 *        id:
 *              type: integer
 *        code:
 *              type: string 
 *        name:
 *              type: string           
 *        credits:
 *              type: integer           
 *        quotas:
 *              type: integer           
 *        state:
 *              type: integer
 *      required:
 *        - id
 *        - code
 *        - name
 *        - credits
 *        - quotas
 *        - state
 * 
 *    inscription:
 *      type: object
 *      properties:
 *        id_student:
 *              type: integer  
 *        id_subject:
 *              type: integer
 *        registrationDate:
 *                 type: integer
 *                 format: date 
 *      required:
 *        - id_student
 *        - id_subject
 *        - registrationDate 
 * 
 */
router.get('/inscripted-students', async (req, res, next) => {
    try {
        const reply = await GET_ASYNC("Estudiantes_Inscritos")
        if (reply) return res.json(JSON.parse(reply));

        const inscripted = await prisma.$queryRaw`select count(id_student) as cantidad_estudiantes_inscritos ,
        id_subject as id_asignatura,s.name as asignatura from inscription i 
        join subjects s on i.id_subject = s.id group by id_subject,s.name, id_subject;`
        
        await SET_ASYNC("Estudiantes_Inscritos", JSON.stringify(inscripted))
        redisClient.expire("Estudiantes_Inscritos", 60);

        res.json(inscripted)
    } catch (error) {
        console.log(error)
    }

})



/**
 * @swagger
 * /inscription:
 *   get:
 * 
 *     summary: Returns all inscriptions
 *     tags: [inscription]
 *     responses:
 *       200:
 *         description: the list of the inscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */

router.get('/inscription', async (req, res, next) => {
    try {
        const inscription = await prisma.inscription.findMany({})
        if (next.length) {
            res.json(inscription)
        } else {
            res.status(204).send('204 - No hay elementos para mostrar');
        }
    } catch (error) {
        res.status(400).send('Error en la sintaxis');
    }
})

/**
 * @swagger
 * /inscription/{id_student}:
 *   get:
 *     summary: Returns student inscriptions
 *     tags: [inscription]
 *     parameters:
 *      - in: path
 *        name: id_student
 *        required: true
 *        type: int
 *        description: The inscription ID and the data.
 *     description: Get a list of inscriptions by id 
 *     responses:
 *       200:
 *         description: Returns the requested inscription
 *       500:
 *         description: Error
 */


router.get('/inscription/:id_student', async (req, res, next) => {
    try {
        const { id_student } = req.params
        const inscription = await prisma.inscription.findMany({
            where: {
                id_student: String(id_student),
            }
        })
        if (inscription.length == 0) {
            res.status(404).send('La inscripcion no existe');
        } else {
            res.json(inscription)
        }
    } catch (error) {
        next(error);
    }
})

/**
 * @swagger
 * /inscription:
 *   post:
 *     summary: Create a new inscription
 *     tags: [inscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/inscription'
 *     responses:
 *       200:
 *         description: new inscription
 */


router.post('/inscription', async (req, res, next) => {
    try {
        const inscription = await prisma.inscription.create({
            data: req.body
        })
        res.status(200).send('La inscripcion se ha insertado correctamente');
    } catch (error) {
        if (error.code == "P2003") {
            res.status(409).send('El estudiante o la materia a inscribir no existe');
        } else {
            res.status(422).send('Datos incompletos');
        }

    }
})

/**
 * @swagger
 * /inscription/{id}:
 *   delete:
 *     summary: Returns if the student is eliminated or not
 *     tags: [inscription]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: an erase status 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */

router.delete('/inscription/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const deletedInscription = await prisma.inscription.delete({
            where: {
                id: Number(id),
            }
        })
        //    res.json(deletedInscription)
        res.status(200).send('Eliminado correctamente');
    } catch (error) {
        res.status(404).send('La inscripcion a eliminar no fue encontrada');
        //    next(error);
    }
})

/**
 * @swagger
 * /inscription/{id}:
 *   patch:
 *     summary: Update inscription with id
 *     tags: [inscription]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: Int
 *        description: The inscription ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/inscription'
 *     responses:
 *       201:
 *         description: Updated
 */

router.patch('/inscription/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const inscription = await prisma.inscription.update({
            where: {
                id: Number(id),
            },
            data: req.body
        })
        res.status(201).send('La inscripcion se ha actualizado correctamente');
    } catch (error) {
        res.status(422).send('Hay un error a la hora de actualizar la inscripcion');
    }
})


/**________________________________________________________________________________ */


/**
 * @swagger
 * /students:
 *   get:
 *     summary: Returns all students
 *     tags: [students]
 *     responses:
 *       200:
 *         description: the list of the students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */



router.get('/students', async (req, res, next) => {
    try {
        const students = await prisma.students.findMany({})
        res.json(students)
    } catch (error) {
        res.status(400).send('Error en la sintaxis');
    }
})


/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Returns student with id
 *     tags: [students]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The student ID and his/her data.
 *     description: Get a student by id
 *     responses:
 *       200:
 *         description: Returns the requested student
 */

router.get('/students/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const students = await prisma.students.findMany({
            where: {
                id: String(id),
            }
        })
        if (students.length == 0) {
            res.status(404).send('El estudiante no existe');
        } else {
            res.json(students)
        }
    } catch (error) {
        next(error);
    }
})


/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student
 *     tags: [students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Students'
 *     responses:
 *       200:
 *         description: new Student
 *     
 */
router.post('/students', upload.single('myFile'), async (req, res, next) => {
    const { originalname, buffer } = req.file;
    console.log(originalname);
    const containerClient = blobService.getContainerClient("imagenes");
    await containerClient.getBlockBlobClient(originalname).uploadData(buffer);
    try {
        const id = req.body.id
        const document_number = req.body.document_number
        const document_type = req.body.document_type
        const name = req.body.name
        const surname = req.body.surname
        const state = req.body.state
        let imagen = req.body.imagen
        BLOBIMAGE = "https://imagenesdistri.blob.core.windows.net/imagenes/"
        imagen = BLOBIMAGE + originalname
        console.log(imagen)
        const students = await prisma.students.create({ data: { id, document_number, document_type, name, surname, state, imagen } })
        res.status(200).send('El estudiante se ha insertado correctamente');
    } catch (error) {
        if (!error.code) {
            res.status(422).send('Datos incompletos');
            console.log(error)
        } else {
            res.status(409).send('El estudiante a inscribir ya existe');


        }
    }
})

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Returns if the student is eliminated or not
 *     tags: [students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: an erase status 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */

router.delete('/students/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const deletedstudents = await prisma.students.delete({
            where: {
                id: String(id),
            }
        })
        res.status(200).send('Eliminado correctamente');
    } catch (error) {
        res.status(404).send('El estudiante a eliminar no fue encontrado');
    }
})

/**
 * @swagger
 * /students/{id}:
 *   patch:
 *     summary: Update student with id
 *     tags: [students]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: Int
 *        description: The student ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Students'
 *     responses:
 *       201:
 *         description: Updated
 */

router.patch('/students/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const students = await prisma.students.update({
            where: {
                id: String(id),
            },
            data: req.body
        })
        res.status(201).send('201 - El usuario se ha actualizado correctamente');
    } catch (error) {
        res.status(422).send('Hay un error a la hora de actualizar el estudiante');
    }
})
/**________________________________________________________________________________ */
/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Returns all subjects
 *     tags: [subjects]
 *     responses:
 *       200:
 *         description: the list of the subjects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */

router.get('/subjects', async (req, res, next) => {
    try {
        const subjects = await prisma.subjects.findMany({})
        res.json(subjects)
    } catch (error) {
        res.status(400).send('Error en la sintaxis');
    }
})

/**
 * @swagger
 * /subjects/{id}:
 *   get:
 *     summary: Returns subject with id
 *     tags: [subjects]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The subjects ID and the data of the subject.
 *     description: Get a student by id
 *     responses:
 *       200:
 *         description: Returns the requested subject
 */

router.get('/subjects/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const subjects = await prisma.subjects.findMany({
            where: {
                id: Number(id),
            }
        })
        if (subjects.length == 0) {
            res.status(404).send('La asignatura no existe');
        } else {
            res.json(subjects)
        }
    } catch (error) {
        next(error);
    }
})

/**
 * @swagger
 * /subject:
 *   post:
 *     summary: Create a new subject
 *     tags: [subjects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/subjects'
 *     responses:
 *       200:
 *         description: new subjects
 *     
 */


router.post('/subjects', async (req, res, next) => {
    try {
        const students = await prisma.subjects.create({
            data: req.body
        })
        res.status(200).send('Se ha insertado correctamente');

    } catch (error) {
        if (!error.code) {
            res.status(422).send('Datos incompletos');
        } else {
            res.status(409).send(' ya existe');
        }
    }
})


/**
 * @swagger
 * /subjects/{id}:
 *   delete:
 *     summary: Returns if the student is eliminated or not
 *     tags: [subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: an erase status 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */

router.delete('/subjects/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const deletedsubjects = await prisma.subjects.delete({
            where: {
                id: Number(id),
            }
        })
        res.status(200).send('Eliminado correctamente');
    } catch (error) {
        res.status(404).send('La asignatura a eliminar no fue encontrada');
    }
})

/**
 * @swagger
 * /subjects/{id}:
 *   patch:
 *     summary: Update student with id
 *     tags: [subjects]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: Int
 *        description: The subject ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/subjects'
 *     responses:
 *       201:
 *         description: Updated
 */

router.patch('/subjects/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const subjects = await prisma.subjects.update({
            where: {
                id: Number(id),
            },
            data: req.body
        })
        res.status(201).send('La materia se ha actualizado correctamente');
    } catch (error) {
        res.status(422).send('Hay un error a la hora de actualizar la materia');
    }
})

module.exports = router;

