const Event = require('../../models/Event')
const User = require('../../models/User')
const { dateToString } = require('../../helpers/date')

const events = async (eventsIds) => {
	try {
		const events = await Event.find({ _id: { $in: eventsIds } })
		return events.map((event) => {
			return populateEvent(event)
		})
	} catch (error) {
		throw error
	}
}

const singleEvent = async (eventId) => {
	try {
		const event = await Event.findById(eventId)

		return {
			...event._doc,
			date: dateToString(event.date),
			creator: userFun.bind(this, event.creator)
		}
	} catch (error) {
		console.log(error)
		throw error
	}
}

const userFun = async (userId) => {
	try {
		const user = await User.findById(userId).select('-password')
		return {
			...user._doc,
			createdEvents: events.bind(this, user.createdEvents)
		}
	} catch (error) {
		throw error
	}
}

module.exports = { userFun, singleEvent, events }
