const bcrypt = require('bcryptjs')
function makeUsersArray () {
    return [
        {
            id: 1,
            fname: 'Example',
            lname: 'User',
            email: "exampleuser@example.com",
            username: "exampleuser",
            password: 'password',
        },

        {
            id: 123,
            fname: 'Francesca',
            lname: 'Litterio',
            email: 'francesca@litterio.net',
            username: 'flitterio',
            password: 'Abc123!',
    
          },
    ];
}
function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('cc_users').insert(preppedUsers)
     
  }

module.exports ={
    makeUsersArray,
    seedUsers
}