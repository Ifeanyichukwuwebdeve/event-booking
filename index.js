const express = require('express')
// const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()
const { graphqlHTTP } = require('express-graphql')

const graphQlSchema = require('./graphql/schema/index')
const graphQlResolvers = require('./graphql/resolvers/index')

const app = express()

app.use('/api', graphqlHTTP({
  schema: graphQlSchema,
  rootValue: graphQlResolvers,
  graphiql: true
})
)


app.get('/', (req, res, next) => {
  res.send('Welcome to our server')
})
const connect = process.env.MONGODB_CONNECT
const connectDB = async () => {
  try {
    const res = await mongoose.connect(connect, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Mongodb connected')
  } catch (error) {
    console.log(error)
  }
}


app.listen(8000, connectDB)

