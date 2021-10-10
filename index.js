const express = require('express')
// const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

const Event = require('./models/Event')

const app = express()

app.use('/api', graphqlHTTP({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      events: [Event!]!
    }
    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: async () => {
      const events = await Event.find()
      return events
    },
    createEvent: async (args) => {
      try {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date).toISOString()
        })
        console.log(args.eventInput.date)
        const result = await event.save()
        return result
      } catch (error) {
        console.log(error)
      }
    }
  },
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

