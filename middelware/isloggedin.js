const prisma = require('../prisma/index')

const jwt = require('jsonwebtoken')

const isLoggedin = async(req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            res.send('please login')
            throw new Error('you are not logged in')
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await prisma.user.findUnique({
            where: {
                id: decoded.user
            }
        })
        next()
    } catch (error) {
        throw new Error(error)
    }
}

module .exports = isLoggedin