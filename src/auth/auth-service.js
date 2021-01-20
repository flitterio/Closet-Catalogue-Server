const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const AuthService = {
    getUserWithUserName(db, username) {
      return db('cc_users')
        .where({ username })
        .first()
    },
    comparePasswords(password, hash) {
      return bcrypt.compare(password, hash)
    },

    createJwt(subject, payload) {
        const signinJwt = jwt.sign(payload, config.JWT_SECRET, {
             subject,
             expiresIn: config.JWT_EXPIRY,
             algorithm: 'HS256',
           });
           return signinJwt
         },
         verifyJwt(token) {
            const verifyJwt= jwt.verify(token, config.JWT_SECRET, {
               algorithms: ['HS256'],
             });
             return verifyJwt
           },   
  }
  
  module.exports = AuthService