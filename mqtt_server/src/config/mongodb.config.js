const mongoose = require('mongoose')

const { MONGODB_HOST, MONGO_DB_PASS, MONGO_DB_USER, MONGODB_DB_NAME } = process.env

const option = {
  user: MONGO_DB_USER,
  pass: MONGO_DB_PASS,
}

mongoose.connect(`mongodb://${MONGODB_HOST}/${MONGODB_DB_NAME}`, option).then(() => console.log('Connected to MongoDB.')).catch(err => {
  console.error('MongoDB connection error: ', err)
})

module.exports = mongoose