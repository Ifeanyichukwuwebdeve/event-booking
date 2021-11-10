const Event = require('../../models/Event')
const User = require('../../models/User')
const { populateEvent } = require('./merge')
const { dateToString } = require('../../helpers/date')

module.exports = {
	events: async () => {
		try {
			const events = await Event.find()
			return events.map((event) => {
				return populateEvent(event)
			})
		} catch (error) {
			// console.log(error)
			throw error
		}
	},
	createEvent: async (args, req) => {
		try {
			if (!req.isAuth) throw new Error('Unauthenticated')
			const event = new Event({
				title: args.eventInput.title,
				description: args.eventInput.description,
				price: +args.eventInput.price,
				date: dateToString(args.eventInput.date),
				creator: req.userId
			})
			const result = await event.save()
			const user = await User.findById(req.userId)
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
