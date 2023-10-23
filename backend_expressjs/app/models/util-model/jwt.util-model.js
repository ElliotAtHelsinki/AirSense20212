const jwt = require('jsonwebtoken')

class JwtUtilModel {
  constructor() {
    this.key = process.env.JWT_SECRET_KEY
    this.env = process.env.STATUS
  }

  genKey(user) {
    return jwt.sign({ id: user.id }, this.key, {
      expiresIn: this.env === 'development' ? '10d' : '1d',
    })
  }

  genKeyResetPass(user, newPass) {
    return jwt.sign({ id: user.id, newPass }, this.key, {
      expiresIn: '2h',
    })
  }

  genKeyActivateAccount(user) {
    return jwt.sign({ id: user.id }, this.key, {
      expiresIn: '5d',
    })
  }

  verify(token) {
    return jwt.verify(token, this.key, (err, decoded) => {
      if (err) return Promise.reject(err)
      else return Promise.resolve(decoded)
    })
  }
}

module.exports = new JwtUtilModel()
