const { expect } = require('chai')
const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
//const { makeItemsArray } = require('./items.fixtures')
const { makeUsersArray, seedUsers } = require('./users.fixtures')

describe('Users Endpoints', function() {
  let db

  const  testUsers  = makeUsersArray()
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

  describe(`POST /api/users`, () => {
    context(`User Validation`, () => {
    beforeEach('insert users', () =>
        seedUsers(
          db,
          testUsers,
        )
      )

      const requiredFields = ['username', 'password', 'fname', 'lname', 'email']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          username: 'test username',
          password: 'test password',
          fname: 'test fname',
          lname: 'test lname',
          email: 'test email',
        }

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            })
        })
      })
      it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
             const userShortPassword = {
               username: 'test username',
               password: '1234567',
               fname: 'test fname',
               lname: 'test lname',
               email: 'test email',
             }
             return supertest(app)
               .post('/api/users')
               .send(userShortPassword)
               .expect(400, { error: `Password must be longer than 8 characters` })
           })
        it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
               const userLongPassword = {
                 username: 'test user_name',
                 password: '*'.repeat(73),
                 fname: 'test first name',
                 lname: 'test last name',
                 email: 'test email',
               }
               // console.log(userLongPassword)
               // console.log(userLongPassword.password.length)
               return supertest(app)
                 .post('/api/users')
                 .send(userLongPassword)
                 .expect(400, { error: `Password must be less than 72 characters` })
             })
      it(`responds 400 error when password starts with spaces`, () => {
             const userPasswordStartsSpaces = {
             username: 'test user_name',
             password: ' 1Aa!2Bb@',
             fname: 'test fname',
             lname: 'test lame',
             email: 'test email',
                 }
             return supertest(app)
              .post('/api/users')
              .send(userPasswordStartsSpaces)
              .expect(400, { error: `Password must not start or end with empty spaces` })
               })
      it(`responds 400 error when password ends with spaces`, () => {
          const userPasswordEndsSpaces = {
          username: 'test user_name',
          password: '1Aa!2Bb@ ',
          fname: 'test fname',
          lname: 'test lname',
          email: 'email',
                   }
              return supertest(app)
                .post('/api/users')
                .send(userPasswordEndsSpaces)
                .expect(400, { error: `Password must not start or end with empty spaces` })
                 })

      it(`responds 400 error when password isn't complex enough`, () => {
        const userPasswordNotComplex = {
          username: 'test user_name',
          password: '11AAaabb',
          fname: 'test fname',
          lname: 'test lname',
          email: 'email',
        }
        return supertest(app)
          .post('/api/users')
          .send(userPasswordNotComplex)
          .expect(400, { error: `Password must contain 1 upper case, lower case, number and special character` })
                   })

    it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
         const duplicateUser = {
         username: testUser.username,
         password: '11AAaa!!',
         fname: 'test fname',
         lname: 'test lname',
         email: 'test email',
         }
       return supertest(app)
           .post('/api/users')
           .send(duplicateUser)
           .expect(400, { error: `Username already taken` })
       })
    })

  context(`Happy path`, () => {
         it(`responds 201, serialized user, storing bcrypted password`, () => {
           const newUser = {
             username: 'test username',
             password: '11AAaa!!',
             fname: 'test fname',
             lname: 'test lname',
             email: 'test email',
           }
           return supertest(app)
             .post('/api/users')
             .send(newUser)
             .expect(201)
             .expect(res => {
               expect(res.body).to.have.property('id')
               expect(res.body.username).to.eql(newUser.username)
               expect(res.body.fname).to.eql(newUser.fname)
               expect(res.body.lname).to.eql(newUser.lname)
               expect(res.body.email).to.eql(newUser.email)
               expect(res.body).to.not.have.property('password')
               expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
               const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
               const actualDate = new Date(res.body.date_created).toLocaleString()
               expect(actualDate).to.eql(expectedDate)
             })
             .expect(res =>
                 db
                   .from('cc_users')
                   .select('*')
                   .where({ id: res.body.id })
                   .first()
                   .then(row => {
                     expect(row.username).to.eql(newUser.username)
                     expect(row.fname).to.eql(newUser.fname)
                     expect(row.lname).to.eql(newUser.lname)
                     expect(row.email).to.eql(null)
                     const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                     const actualDate = new Date(row.date_created).toLocaleString()
                     expect(actualDate).to.eql(expectedDate)

                     return bcrypt.compare(newUser.password, row.password)
                   })
                 .then(compareMatch => {
                   expect(compareMatch).to.be.true
                 })
             )
        })
  })
})
})