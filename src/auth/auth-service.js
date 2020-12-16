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
           return jwt.sign(payload, config.JWT_SECRET, {
             subject,
             algorithm: 'HS256',
           })
         },
  }
  
  module.exports = AuthService