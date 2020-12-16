const express = require('express')
const AuthService = require('./auth-service')

const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter
  .post('/signin', jsonBodyParser, (req, res, next) => {
      const { username, password} = req.body
      const signinUser = {username, password}
    
    for (const [key, value] of Object.entries(signinUser))
    if(value == null)
    return res.status(400).json({
        error: `Missing '${key}' in request body` 
    })
    AuthService.getUserWithUserName(
      req.app.get('db'),
      signinUser.username
    )
    .then(dbUser => {
      if(!dbUser)
      return res.status(400).json({
        error: 'Incorrect username or password',
      })
      return AuthService.comparePasswords(signinUser.password, dbUser.password)
         .then(compareMatch => {
           if (!compareMatch)
             return res.status(400).json({
               error: 'Incorrect username or password',
             })
        const sub = dbUser.username
        const payload = { userid: dbUser.id }
        res.send({
          authToken: AuthService.createJwt(sub, payload),
                 })
    })
  })
    .catch(next)
  })

module.exports = authRouter