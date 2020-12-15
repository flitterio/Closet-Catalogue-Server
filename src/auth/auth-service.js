const AuthService = {
    getUserWithUserName(db, username) {
      return db('cc_users')
        .where({ username })
        .first()
    },
    parseBasicToken(token) {
      return Buffer
        .from(token, 'base64')
        .toString()
        .split(':')
    },
  }
  
  module.exports = AuthService