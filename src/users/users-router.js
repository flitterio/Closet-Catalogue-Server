const express = require('express')
const path = require('path')
const { serializeUser } = require('./users-service')
const UsersService = require('./users-service')
const usersRouter = express.Router()
const jsonBodyParser = express.json()

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
  .route('/:userid')
  .all((req, res, next) => {
    UsersService.getUserInfo(
      req.app.get('db'),
      req.params.userid
    )
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: { message: `User doesn't exist` }
          })
        }
        res.user = user
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeUser(res.user))
  })
  
module.exports = usersRouter