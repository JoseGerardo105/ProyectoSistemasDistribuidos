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
 *     tags: [Inscriptions]
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
        res.json(inscription)
    } catch (error) {
        next(error)
    }
})

router.get('/inscription/:id_student', async (req, res, next) => {
    try {
        const { id_student } = req.params
        const inscription = await prisma.inscription.findMany({
            where: {
                id_student: Number(id_student),
            }
        })
        res.json(inscription)
    } catch (error) {
        next(error)
    }
})



router.post('/inscription', async (req, res, next) => {
    try {
        const inscription = await prisma.inscription.create({
            data: req.body,
        })
        res.json(inscription)
    } catch (error) {
        next(error)
    }
})

router.delete('/inscription/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const deletedInscription = await prisma.inscription.delete({
            where: {
                id: Number(id),
            }
        })
        res.json(deletedInscription)
    } catch (error) {
        next(error)
    }
})

router.patch('/inscription/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const inscription = await prisma.inscription.update({
            where: {
                id: Number(id),
            },
            data: req.body
        })
        res.json(inscription)
    } catch (error) {
        next(error)
    }
})


/**________________________________________________________________________________ */

router.get('/students', async (req, res, next) => {
    try {
        const students = await prisma.students.findMany({})
        res.json(students)
    } catch (error) {
        next(error)
    }
})

router.get('/students/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const students = await prisma.students.findMany({
            where: {
                id: Number(id),
            }
        })
        res.json(students)
    } catch (error) {
        next(error)
    }
})



router.post('/students', async (req, res, next) => {
    try {
        const students = await prisma.students.create({
            data: req.body,
        })
        res.json(students)
    } catch (error) {
        next(error)
    }
})

router.delete('/students/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const deletedstudents = await prisma.students.delete({
            where: {
                id: Number(id),
            }
        })
        res.json(deletedstudents)
    } catch (error) {
        next(error)
    }
})

router.patch('/students/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const students = await prisma.students.update({
            where: {
                id: Number(id),
            },
            data: req.body
        })
        res.json(students)
    } catch (error) {
        next(error)
    }
})



/**________________________________________________________________________________ */

router.get('/subjects', async (req, res, next) => {
    try {
        const subjects = await prisma.subjects.findMany({})
        res.json(subjects)
    } catch (error) {
        next(error)
    }
})

router.get('/subjects/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const subjects = await prisma.subjects.findMany({
            where: {
                id: Number(id),
            }
        })
        res.json(subjects)
    } catch (error) {
        next(error)
    }
})



router.post('/subjects', async (req, res, next) => {
    try {
        const subjects = await prisma.subjects.create({
            data: req.body,
        })
        res.json(subjects)
    } catch (error) {
        next(error)
    }
})

router.delete('/subjects/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const deletedsubjects = await prisma.subjects.delete({
            where: {
                id: Number(id),
            }
        })
        res.json(deletedsubjects)
    } catch (error) {
        next(error)
    }
})

router.patch('/subjects/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const subjects = await prisma.subjects.update({
            where: {
                id: Number(id),
            },
            data: req.body
        })
        res.json(subjects)
    } catch (error) {
        next(error)
    }
})

module.exports = router;

