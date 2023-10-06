const jwt = require('jsonwebtoken')

const getJwtToken = (userId) => {
    return jwt.sign({userId: userId}, process.env.JWT_SECRET, {expiresIn: '1day'})
}

module.exports = getJwtToken;