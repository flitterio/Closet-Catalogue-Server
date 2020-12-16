const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const {seedUsers} = require('./users.fixtures');
const {makeUsersArray} = require ('./users.fixtures')



describe.only('Auth Endpoints', function() {
  let db

  const  testUsers  = makeUsersArray();
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE cc_items, cc_users RESTART IDENTITY CASCADE'))
  
    afterEach('cleanup',() => db.raw('TRUNCATE cc_items, cc_users RESTART IDENTITY CASCADE'))

  describe(`POST /api/auth/signin`, () => {
    beforeEach('insert users', () =>
      seedUsers(
        db,
        testUsers,
      )
    )

    const requiredFields = ['username', 'password']

 requiredFields.forEach(field => {
   const signinAttemptBody = {
     username: testUser.username,
     password: testUser.password,
   }

   it(`responds with 400 required error when '${field}' is missing`, () => {
     delete signinAttemptBody[field]

     return supertest(app)
       .post('/api/auth/signin')
       .send(signinAttemptBody)
       .expect(400, {
         error: `Missing '${field}' in request body`,
       })
   })
     })
     it(`responds 400 'invalid username or password' when bad username`, () => {
           const userInvalidUser = { username: 'user-not', password: 'existy' }
           return supertest(app)
             .post('/api/auth/signin')
             .send(userInvalidUser)
             .expect(400, { error: `Incorrect username or password` })
         })
         it(`responds 400 'invalid username or password' when bad password`, () => {
               const userInvalidPass = { username: testUser.username, password: 'incorrect' }
               return supertest(app)
                 .post('/api/auth/signin')
                 .send(userInvalidPass)
                 .expect(400, { error: `Incorrect username or password` })
             })
          it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
                 const userValidCreds = {
                   username: testUser.username,
                    password: testUser.password,
                 }
                 const expectedToken = jwt.sign(
                   { userid: testUser.id }, // payload
                   process.env.JWT_SECRET,
                   {
                     subject: testUser.username,
                     algorithm: 'HS256',
                   }
                 )
                 return supertest(app)
                   .post('/api/auth/signin')
                   .send(userValidCreds)
                   .expect(200, {
                     authToken: expectedToken,
                   })
               })
  })
})