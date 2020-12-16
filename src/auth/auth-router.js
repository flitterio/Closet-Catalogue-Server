const express = require('express')

const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter
  .post('/signin', jsonBodyParser, (req, res, next) => {
      const { username, password}
    
    for (const [key, value] of Object.entries(signinUser))
    if(value == null)
    return res.status(400).json({
        error: `Missing '${key}' in request body` 
    })
      res.send('ok')
  })

module.exports = authRouter