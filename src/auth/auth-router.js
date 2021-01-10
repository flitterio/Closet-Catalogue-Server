const express = require('express')
const AuthService = require('./auth-service')
const { requireAuth } = require('../middleware/jwt-auth')

const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter
  .post('/signin', jsonBodyParser, (req, res, next) => {
      const { username, password} = req.body
      const signinUser = {username, password}
    
      console.log('signin user ', signinUser);
      
    for (const [key, value] of Object.entries(signinUser))
    if(value == null)
        return (res.status(400).json({
            error: `Missing '${key}' in request body` 
        }),
          console.log('value==null'))

    AuthService.getUserWithUserName(
      req.app.get('db'),
      signinUser.username
    )

    .then(dbUser => {
      console.log('dbUser', dbUser)
      if(!dbUser)
      return (res.status(400).json({
        error: 'Incorrect username or password',
      }),
        
      console.log('no dbUser'))
      
      return AuthService.comparePasswords(signinUser.password, dbUser.password)
         .then(compareMatch => {
           console.log('compare match', compareMatch)
           if (!compareMatch)
             return (res.status(400).json({
               error: 'Incorrect username or password',
             }),
             console.log('compare didnt match'))
        const sub = dbUser.username
        const payload = { usersid: dbUser.id, fname: dbUser.fname, lname: dbUser.lname, email: dbUser.email  }
        res.send({
          authToken: AuthService.createJwt(sub, payload),
                 })
    })
  })
    .catch(next)
  })
  authRouter.post('/refresh', requireAuth, (req, res) => {
    const sub = req.user.username
    const payload = { userid: req.user.id }
    res.send({
      authToken: AuthService.createJwt(sub, payload),
    })
  })

module.exports = authRouter