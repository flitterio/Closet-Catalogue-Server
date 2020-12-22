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

    // parseBasicToken(token) {
    //   return Buffer
    //     .from(token, 'base64')
    //     .toString()
    //     .split(':')
    // },
    createJwt(subject, payload) {
      console.log('payload', payload)
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
             console.log('verifyjwt', verifyJwt)
             return verifyJwt
           },   
  }
  
  module.exports = AuthService