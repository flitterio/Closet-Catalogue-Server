const knex = require('knex')
const app = require('./app')
const { PORT, DATABASE_URL} = require('./config')

const db = knex({
  client: 'pg',
  conection: DATABASE_URL,
})

app.set('db', db)

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})
