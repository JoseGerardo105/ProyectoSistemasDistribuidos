const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { promisify } = require('util')
const { Console } = require('console')

exports.register = async (req, res) => {
    try {
        const name = req.body.name
        const user = req.body.user
        let pass = req.body.pass
        let passHash = await bcryptjs.hash(pass, 8)
        pass = passHash
        await prisma.users.create({ data: { name, user, pass } })
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
}




exports.login = async (req, res) => {
    try {
        const user = req.body.usuario
        const pass = req.body.pass
        if (!user || !pass) {
            console.log("err")
        } else {
            const results = await prisma.users.findMany({ where: { user: String(user), } })
            if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                

            } else {
                //inicio de sesión OK
                const id = results[0].id
                const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
                    expiresIn: process.env.JWT_TIEMPO_EXPIRA
                })
                console.log("TOKEN: " + token + " para el USUARIO : " + user)
                res.json({token});
                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
               
                
            }
        }
    } catch (error) {
        console.log(error)
    }

}

exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const id = req.body.id
            //const { id } = req.params
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            results = await prisma.users.findMany({ where: { [decodificada.id] : id, }, },)
                if (!results) { return next() }
                req.user = results[([decodificada.id]-1)]
                return next()
            
        } catch (error) {0
            console.log(error)
            return next()
        }
    } else {
        res.redirect('/login')
    }
}



exports.logout = () => {
    localStorage.removeItem('token')
    return res.redirect('/login')
}