const express = require('express')
const bodyParser = require('body-parser')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

const app = express()

// app.use(bodyParser.json())

app.use('/api', graphqlHTTP({
  schema: buildSchema(`
    type RootQuery {
      events: [String!]!
    }
    type RootMutation {
      createEvent(name: String): String
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return ['Romantic Cooking', 'Sailing', 'All-night coding']
    },
    createEvent: (arg) => {
      const eventName = arg.name
      return eventName
    }
  },
  graphiql: true
})
)


app.get('/', (req, res, next) => {
  res.send('Welcome to our server')
})

app.listen(8000)
