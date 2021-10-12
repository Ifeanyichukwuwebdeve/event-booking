const bcrypt = require('bcryptjs')

const Event = require('../../models/Event')
const User = require('../../models/User')

const events = async eventsIds => {
  try {
    const events = await Event.find({ _id: {$in: eventsIds }})
    return events.map(event => {
      return { ...event._doc, date: new Date(event.date).toISOString(), creator: userFun.bind(this, event.creator)}
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
module.exports = {
  events: async () => {
    const events = await Event.find()
    return events.map(event => {
      const result = { ...event._doc, date: new Date(event.date).toISOString(), creator: userFun.bind(this, event.creator)}
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
      return { ...result._doc, date: new Date(result.date).toISOString(), creator: userFun.bind(this, result.creator)}
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
}