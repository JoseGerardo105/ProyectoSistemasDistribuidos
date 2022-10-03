const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


/**
 * @swagger
 * /inscription:
 *   get:
 *     summary: Returns all inscriptions
 *     tags: [Posts]
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
 * /inscription/:id_student:
 *   get:
 *     summary: Returns inscriptions from one student
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: a list of inscriptions according to the student id 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
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
 *     summary: Returns an boolean state; if that inscription could be inscripted or not
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: an boolean state according to the inscription status 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */


router.post('/inscription', async (req, res, next) => {
    try {
        const inscription = await prisma.inscription.create({
            data: req.body,
        })
        res.status(200).send('La  se ha insertado correctamente'); 
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
 * /inscription/:id:
 *   delete:
 *     summary: Returns if that inscription is eliminated or not
 *     tags: [Posts]
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
 * /inscription/:id:
 *   patch:
 *     summary: Returns an inscripction actualization status
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: an inscription actualization status 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
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
 *     tags: [Posts]
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
 * /students/:id:
 *   get:
 *     summary: Returns an student data
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: a data of students according to the id 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */

router.get('/students/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const students = await prisma.students.findMany({
            where: {
                id: Number(id),
            }
        })
        if (inscription.length == 0) {
            res.status(404).send('El estudiante no existe');
        } else {
            res.json(inscription);
        }
        res.json(students)
    } catch (error) {
        next(error);
    }
})


/**
 * @swagger
 * /students:
 *   post:
 *     summary: Returns an boolean state; if that student exist or not
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: an boolean state according if the student exists in the db 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
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
 * /students/:id:
 *   delete:
 *     summary: Returns if the student is eliminated or not
 *     tags: [Posts]
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
 * /students/:id:
 *   patch:
 *     summary: Returns an student actualization status
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: an student actualization status 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
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
 *     tags: [Posts]
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
 * /subjects/:id:
 *   get:
 *     summary: Returns data from an specific subject
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: a subject data according to the id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */

router.get('/subjects/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const subjects = await prisma.subjects.findMany({
            where: {
                id: Number(id),
            }
        })
        if (inscription.length == 0) {
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
 * /inscription:
 *   post:
 *     summary: Returns an boolean state; if that subject could be inserted in the db or not
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: an boolean state according to the subject insertion status 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */

router.post('/subjects', async (req, res, next) => {
    try {
        const subjects = await prisma.subjects.create({
            data: req.body,
        })
        res.status(200).send('La asignatura se ha insertado correctamente');
    } catch (error) {
        if (!error.code) {
            res.status(422).send('Datos incompletos');
        } else {   
            res.status(409).send('La materia a inscribir ya existe');
        }
    }
})


/**
 * @swagger
 * /subjects/:id:
 *   delete:
 *     summary: Returns if the subject is eliminated or not
 *     tags: [Posts]
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
 * /subjects/:id:
 *   patch:
 *     summary: Returns an subject actualization status
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: an subject actualization status 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
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

