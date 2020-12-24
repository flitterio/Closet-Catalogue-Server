const express = require('express')
const path = require('path')
const { serializeUser } = require('./users-service')
const UsersService = require('./users-service')
const usersRouter = express.Router()
const jsonBodyParser = express.json()
const {requireAuth} = require('../middleware/jwt-auth')

  usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { password, username, fname, lname, email } = req.body
    const regUser = {password, username, fname, lname, email}

    console.log(regUser)
    
    for (const field of ['fname', 'lname', 'username', 'password', 'email'])
       if (!req.body[field])
         return res.status(400).json({
           error: `Missing '${field}' in request body`        
           })

    const passwordError = UsersService.validatePassword(password)
           
      if (passwordError)
        return res.status(400).json({ error: passwordError })
      
      UsersService.hasUserWithUserName(
        req.app.get('db'),
        username
      )
        .then(hasUserWithUserName => {
          if(hasUserWithUserName)
            return res.status(400).json({ error: `Username already taken`})

          return UsersService.hashPassword(password)
           .then(hashedPassword => {
              const newUser = {
                 username,
                 password: hashedPassword,
                 fname,
                 lname,
                 email,
                 date_created: 'now()',
                   }
              
               return UsersService.insertUser(
                 req.app.get('db'),
                 newUser
               )
                 .then(user => {
                   res
                     .status(201)
                     .location(path.posix.join(req.originalUrl, `/${user.id}`))
                     .json(UsersService.serializeUser(user))
             })
         })

      })
      .catch(next)
  })

usersRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    UsersService.getUserInfo(
      req.app.get('db'),
      req.user.id
    )
    .then(user =>{
       res.json(user)
    })
      .catch(next)
  })
  
  
module.exports = usersRouter