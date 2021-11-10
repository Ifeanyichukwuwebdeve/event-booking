const Event = require('../../models/Event')
const User = require('../../models/User')

const DataLoader = require('dataloader')

const { dateToString } = require('../../helpers/date')

const eventLoader = new DataLoader((eventIds) => {
	return events(eventIds)
})

const userLoader = new DataLoader((userIds) => {
	return User.find({ _id: { $in: userIds } }).select('-password')
})

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
		const event = await eventLoader.load(eventId.toString())
		return event
	} catch (error) {
		// console.log(error)
		throw error
	}
}

// populate Data

const populateEvent = (event) => {
	return {
		...event._doc,
		date: dateToString(event.date),
		creator: userFun.bind(this, event.creator)
	}
}

const userFun = async (userId) => {
	try {
		const user = await userLoader.load(userId.toString())
		return {
			...user._doc,
			createdEvents: () => eventLoader.loadMany(user.createdEvents)
		}
	} catch (error) {
		console.log(error)
		throw error
	}
}

const populateBooking = (booking) => {
	return {
		...booking._doc,
		_id: booking._id,
		user: userFun.bind(this, booking.user),
		event: singleEvent.bind(this, booking.event),
		createdAt: dateToString(booking.createdAt),
		updatedAt: dateToString(booking.updatedAt)
	}
}

module.exports = {
	userFun,
	singleEvent,
	events,
	populateEvent,
	populateBooking
}
