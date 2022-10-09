const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()



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


/**
 * @swagger
 * /inscription:
 *   get:
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
        }else{
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
                id_student: Number(id_student),
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
    }catch (error) {  
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
 *     tags: [Students]
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
                id: Number(id),
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
 *     tags: [Students]
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
router.post('/students', async (req, res, next) => {
    try {
        const students = await prisma.students.create({
            data: req.body
        })
        res.status(200).send('El estudiante se ha insertado correctamente'); 

    } catch (error) {
        if (!error.code) {
            res.status(422).send('Datos incompletos');
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
 *     tags: [Students]
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
                id: Number(id),
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
                id: Number(id),
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
 

 router.post('/subject', async (req, res, next) => {
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

