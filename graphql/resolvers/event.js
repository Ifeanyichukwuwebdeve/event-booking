const Event = require('../../models/Event')
const User = require('../../models/User')
const { userFun } = require('./merge')
const { dateToString } = require('../../helpers/date')

// populate Data

const populateEvent = (event) => {
	return {
		...event._doc,
		date: dateToString(event.date),
		creator: userFun.bind(this, event.creator)
	}
}

module.exports = {
	events: async () => {
		try {
			const events = await Event.find()
			return events.map((event) => {
				return populateEvent(event)
			})
		} catch (error) {
			throw error
		}
	},
	createEvent: async (args) => {
		try {
			const event = new Event({
				title: args.eventInput.title,
				description: args.eventInput.description,
				price: +args.eventInput.price,
				date: dateToString(args.eventInput.date),
				creator: '61865344a802512e48c8be52'
			})
			const result = await event.save()
			const user = await User.findById('61865344a802512e48c8be52')
			if (!user) {
				throw new Error("User doesn't exist")
			}
			user.createdEvents.push(result)
			await user.save()
			return populateEvent(result)
		} catch (error) {
			throw error
		}
	}
}
