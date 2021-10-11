const express = require('express')
// const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const bcrypt = require('bcryptjs')

const Event = require('./models/Event')
const User = require('./models/User')

const app = express()

const events = async eventsIds => {
  try {
    const events = await Event.find({ _id: {$in: eventsIds }})
    return events.map(event => {
      return { ...event._doc, creator: userFun.bind(this, event.creator)}
    })
  }catch (error) {
    throw error
  }
}

const userFun = async userId => {
  try{
    const user = await User.findById(userId).select('-password')
    return { ...user._doc, createdEvents: events.bind(this, user.createdEvents)}
  } catch (error) {
    throw error
  }
}

app.use('/api', graphqlHTTP({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
      creator: User!
    }

    type User {
      _id: ID!
      email: String!
      password: String
      createdEvents: [Event!]
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
      events: [Event!]!
    }
    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: async () => {
      const events = await Event.find()
      return events.map(event => {
        const result = { ...event._doc, creator: userFun.bind(this, event.creator)}
        return result
      })
    },
    createEvent: async (args) => {
      try {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date).toISOString(),
          creator: '6164394aa3bc5f3b18bba226'
        })
        const result = await event.save()
        const user = await User.findById('6164394aa3bc5f3b18bba226')
        if(!user) {
          throw new Error('User doesn\'t exist')
        }
        user.createdEvents.push(result)
        await user.save()
        return { ...result._doc, creator: userFun.bind(this, result.creator)}
      } catch (error) {
        throw error
      }
    },
    createUser: async (args) => {
      try {
        const foundUser = await User.findOne({ email: args.userInput.email })
        if (foundUser) {
          throw new Error('User exits already')
        }
        const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
        const user = new User ({
          email: args.userInput.email,
          password: hashedPassword
        })
        const result = await user.save()
        return { ...result._doc, password: null }
      } catch (error) {
        throw error
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

