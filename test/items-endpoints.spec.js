const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const itemsRouter = require('../src/items/items-router')
const { makeItemsArray, makeMaliciousItem } = require('./items.fixtures')
const { expect } = require('chai')
const { makeUsersArray } = require('./users.fixtures')
const jwt = require('jsonwebtoken')

describe('items Endpoints', function() {
    let db

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

    function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
      const token = jwt.sign({userid: user.id }, secret, {
        subject: user.username,
        algorithm: 'HS256',
      })
      return `Basic ${token}`
    }

// describe(`Protected endpoints`, () => {
//         const testUsers = makeUsersArray();
//         const testItems = makeItemsArray();
//         beforeEach('inset Items', () => {
//             return db
//             .into('cc_users')
//             .insert(testUsers)
//             .then(() => {
//                 return db
//                     .into('cc_items')
//                     .insert(testItems)   
//             })
//         })
//     })  

describe(`GET /api/items`, () => {
    context(`Given no items`, () => {
        it(`responds with 200 and an empty list`,
        () => {
            return supertest(app)
                .get('/api/items')
                .expect(200, [])
        })
    })

    context('Given there are items in the database ', () => {
        const testUsers = makeUsersArray();
        const testItems = makeItemsArray();

        beforeEach('inset Items', () => {
            return db
            .into('cc_users')
            .insert(testUsers)
            .then(() => {
                return db
                    .into('cc_items')
                    .insert(testItems)   
            })
        })

        it('responds with 200 and all of the Items', () => {
            return supertest(app)
                .get('/api/items')
                .expect(200, testItems)
        })
    })

    context(`Given an XSS attack item`, () => {
        const testUsers = makeUsersArray();
        const { maliciousItem, expectedItem} =makeMaliciousItem()

        beforeEach(`insert malicious Item`, () => {
            return db  
                .into('cc_users')
                .insert(testUsers)
                .then(() =>{
                    return db
                        .into('cc_items')
                        .insert([ maliciousItem ])
                })
        })

        it('removes XSS attack content',  () => {
            return supertest(app)
                .get('/api/items')
                .expect(200)
                .expect(res => {
                    expect(res.body[0].title).to.eql(expectedItem.title)
                    expect(res.body[0].image).to.eql(expectedItem.image)
                })
            })
         })
    })

describe.only(`GET /api/items/:itemid`, () => {
  const testUsers = makeUsersArray();
  const testItems = makeItemsArray();
  beforeEach('inset Items', () => {
      return db
      .into('cc_users')
      .insert(testUsers)
      .then(() => {
          return db
              .into('cc_items')
              .insert(testItems)   
      })
  })

  it(`responds with 401 'Missing bearer token' when no bearer token`, () => {
        return supertest(app)
            .get(`api/items/123`)
            .expect(401, {error: `Missing bearer token`})
    })
    it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
               const validUser = testUsers[0]
               const invalidSecret = 'bad-secret'
               return supertest(app)
               .get(`api/items/1`)
               .set('Authorization', makeAuthHeader(validUser, invalidSecret))
               .expect(401, {error: `Unauthorized request`})
             })
    it.skip(`responds 401 'Unauthorized request' when invalid user`, () => {
           const userInvalidCreds = { username: 'user-not', password: 'existy' }
           return supertest(app)
             .get(`/api/items/1`)
             .set('Authorization', makeAuthHeader(userInvalidCreds))
              .expect(401, { error: `Unauthorized request` })
          })

    it.skip(`responds 401 'Unauthorized request' when invalid password`, () => {
        const testUsers = makeUsersArray();
           const userInvalidPass = { username: testUsers[0].username, password: 'wrong' }
          return supertest(app)
         .get(`/api/items/1`)
         .set('Authorization', makeAuthHeader(userInvalidPass))
         .expect(401, { error: `Unauthorized request` })
             })

    context (`Given no items`, () => {
        const testUsers = makeUsersArray();
        beforeEach(() => 
            db.into('cc_users').insert(testUsers)
            )
            
        it.skip(`responds with 404`, () => {
          const itemId = 123456
          return supertest(app)
            .get(`/api/items/${itemId}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(404, { error: { message: `Item doesn't exist` } })
        })
      })
  
      context('Given there are items in the database', () => {
        const testUsers = makeUsersArray();
        const testItems = makeItemsArray();
  
        beforeEach('insert Items', () => {
          return db
            .into('cc_users')
            .insert(testUsers)
            .then(() => {
              return db
                .into('cc_items')
                .insert(testItems)
            })
        })
  
  
        it.skip('responds with 200 and the specified Items', () => {
          const itemId = 2
          const expectedItem = testItems[itemId - 1]
          return supertest(app)
            .get(`/api/items/${itemId}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(200, expectedItem)
        })
      })
  
      context(`Given an XSS attack Item`, () => {
        const testUsers = makeUsersArray();
        const { maliciousItem, expectedItem } = makeMaliciousItem()
  
        beforeEach('insert malicious Item', () => {
          return db
            .into('cc_users')
            .insert(testUsers)
            .then(() => {
              return db
              .into('cc_items')
              .insert([ maliciousItem ])
            })
        })
  
         it.skip('removes XSS attack content', () => {
           return supertest(app)
            .get(`/api/items/${maliciousItem.id}`)
           .set('Authorization', makeAuthHeader(testUsers[0]))
             .expect(200)
             .expect(res => {
               expect(res.body.title).to.eql(expectedItem.title)
               expect(res.body.image).to.eql(expectedItem.image)
             })
         })
      })
    })

describe(`POST /api/items`, () => {
        const testUsers = makeUsersArray();
        const testUser = testUsers[0]
            beforeEach('insert Users', () => {
              return db
                .into('cc_users')
                .insert(testUsers)
            })
        
            it(`creates a item, responding with 201 and the new item`, () => {
              const newItem = {
                title: 'Test new Item',
                image: 'Test new Item image',
                userid: 1,
                
      
              }
              return supertest(app)
                .post('/api/items')
                .set('Authorization', makeAuthHeader(testUsers[0]))
                .send(newItem)
                .expect(201)
                .expect(res => {
                  expect(res.body).to.have.property('id')
                  expect(res.body.title).to.eql(newItem.title)
                  expect(res.body.image).to.eql(newItem.image)
                  expect(res.body.userid).to.eql(testUser.id)
                  expect(res.headers.location).to.eql(`/api/items/${res.body.id}`)
                  
                })
                .then(res =>
                  supertest(app)
                    .get(`/api/items/${res.body.id}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(res.body)
                )
            })
        
            const requiredFields = ['title']
        
            requiredFields.forEach(field => {
              const newItem = {
               title: 'Test new Item',
              }
        
              it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newItem[field]
        
                return supertest(app)
                  .post('/api/items')
                  .set('Authorization', makeAuthHeader(testUsers[0]))
                  .send(newItem)
                  .expect(400, {
                    error: { message: `Missing '${field}' in request body` }
                  })
              })
            })
        
            it('removes XSS attack content from response', () => {
              const { maliciousItem, expectedItem } = makeMaliciousItem()
              return supertest(app)
                .post(`/api/items`)
                .set('Authorization', makeAuthHeader(testUsers[0]))
                .send(maliciousItem)
                .expect(201)
                .expect(res => {
                  expect(res.body.title).to.eql(expectedItem.title)
                 expect(res.body.image).to.eql(expectedItem.image)
                })
            })
          })

describe(`DELETE /api/items/:itemId`, () => {
    context(`Given no items`, () => {
         it(`responds with 404`, () => {
             const itemId = 123456
                return supertest(app)
                  .delete(`/api/items/${itemId}`)
                  .expect(404, { error: { message: `Item doesn't exist` } })
              })
            })
        
     context('Given there are items in the database', () => {
              const testUsers = makeUsersArray();
              const testItems = makeItemsArray();
        
              beforeEach('insert Items', () => {
                return db
                  .into('cc_users')
                  .insert(testUsers)
                  .then(() => {
                    return db
                      .into('cc_items')
                      .insert(testItems)
                  })
              })
        
        it('responds with 204 and removes the Item', () => {
                const idToRemove = 2
                const expectedItems = testItems.filter(item => item.id !== idToRemove)
                return supertest(app)
                  .delete(`/api/items/${idToRemove}`)
                  .expect(204)
                  .then(res =>
                    supertest(app)
                      .get(`/api/items`)
                      .expect(expectedItems)
                  )
              })
            })
          })

describe(`PATCH /api/items/:itemid`, () => {
    context(`Given no items`, () => {
        it(`responds with 404`, () => {
                const itemId = 123456
                return supertest(app)
                  .delete(`/api/items/${itemId}`)
                  .expect(404, { error: { message: `Item doesn't exist` } })
              })
            })
        
    context('Given there are items in the database', () => {
        const testUsers = makeUsersArray();
        const testItems = makeItemsArray();
        
        beforeEach('insert Items', () => {
            return db
                  .into('cc_users')
                  .insert(testUsers)
                  .then(() =>{
                    return db
                      .into('cc_items')
                      .insert(testItems)
                  })
              })
        
        it('responds with 204 and updates the Item', () => {
            const idToUpdate = 2
            const updateItem = {
                title: 'Test new item',
                image: 'Test new image ',
                userid: 1,
                }
            const expectedItem = {
                 ...testItems[idToUpdate - 1],
                 ...updateItem
                }
            return supertest(app)
                  .patch(`/api/items/${idToUpdate}`)
                  .send(updateItem)
                  .expect(204)
                  .then(res =>
                    supertest(app)
                      .get(`/api/items/${idToUpdate}`)
                      .expect(expectedItem)
                  )
              })
        
            it(`responds with 400 when no required fields supplied`, () => {
                const idToUpdate = 2
                return supertest(app)
                  .patch(`/api/items/${idToUpdate}`)
                  .send({ irrelevantField: 'foo' })
                  .expect(400, {
                    error: {
                      message: `Request body must contain either title, image, season, category, or favorite`
                    }
                  })
              })
        
            it(`responds with 204 when updating only a subset of fields`, () => {
                const idToUpdate = 2
                 const updateItem = {
                  title: 'updated item title',
                }
                const expectedItem = {
                  ...testItems[idToUpdate - 1],
                  ...updateItem
                }
        
                return supertest(app)
                  .patch(`/api/items/${idToUpdate}`)
                  .send({
                    ...updateItem,
                    fieldToIgnore: 'should not be in GET response'
                  })
                  .expect(204)
                  .then(res =>
                    supertest(app)
                      .get(`/api/items/${idToUpdate}`)
                      .expect(expectedItem)
                  )
              })
            })
          })


})
