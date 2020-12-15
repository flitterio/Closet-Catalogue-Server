function makeUsersArray () {
    return [
        {
            id: 1,
            fname: 'Example',
            lname: 'User',
            email: "exampleuser@example.com",
            username: "exampleuser",
            password: '$2a$12$.2zQKu4H2bk0JKQe22XDwOmTzazpFjvlnY8.KlaUVUxVmdlLmfAuW',
        },

        {
            id: 123,
            fname: 'Francesca',
            lname: 'Litterio',
            email: 'francesca@litterio.net',
            username: 'flitterio',
            password: '$2a$12$NuG4ocezpveexIHaLGcrMuIs3ZdvACIfBlsMI5wpc0PI7zWlS6l1q',
    
          },
    ];
}

module.exports ={
    makeUsersArray,
}