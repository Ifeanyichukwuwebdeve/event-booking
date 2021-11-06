const bcrypt = require('bcryptjs')
// const { typeFromAST } = require('graphql')

const Event = require('../../models/Event')
const User = require('../../models/User')
const Booking = require('../../models/Booking')

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

		return populateEvent(event)
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

// populate Data

const populateEvent = (event) => {
	return {
		...event._doc,
		date: new Date(event.date).toISOString(),
		creator: userFun.bind(this, event.creator)
	}
}
const populateBooking = (booking) => {
	return {
		...booking._doc,
		_id: booking._id,
		user: userFun.bind(this, booking.user),
		event: singleEvent.bind(this, booking.event),
		createdAt: new Date(booking.createdAt).toISOString(),
		updatedAt: new Date(booking.updatedAt).toISOString()
	}
}
module.exports = {
	events: async () => {
		const events = await Event.find()
		return events.map((event) => {
			return populateEvent(event)
		})
	},
	bookings: async () => {
		try {
			const bookings = await Booking.find()
			return bookings.map((booking) => {
				return populateBooking(booking)
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
				date: new Date(args.eventInput.date).toISOString(),
				creator: '61865344a802512e48c8be52'
			})
			const result = await event.save()
			const user = await User.findById('61865344a802512e48c8be52')
			if (!user) {
				throw new Error("User doesn't exist")
			}
			user.createdEvents.push(result)
			await user.save()
			return {
				...result._doc,
				date: new Date(result.date).toISOString(),
				creator: userFun.bind(this, result.creator)
			}
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
			const user = new User({
				email: args.userInput.email,
				password: hashedPassword
			})
			const result = await user.save()
			return { ...result._doc, password: null }
		} catch (error) {
			throw error
		}
	},
	bookEvent: async (args) => {
		try {
			const fetchedEvent = await Event.findById(args.eventId)
			if (!fetchedEvent) {
				const error = new Error('Event not found or has been deleted!!')
				throw error
			}
			const booking = new Booking({
				user: '61865344a802512e48c8be52',
				event: fetchedEvent
			})
			const result = await booking.save()
			return populateBooking(result)
		} catch (error) {
			throw error
		}
	},
	cancelBooking: async (args) => {
		try {
			const booking = await Booking.findById(args.bookingId).populate('event')
			const event = {
				...booking.event._doc,
				_id: booking.event._id,
				creator: userFun.bind(this, booking.event.creator)
			}
			await Booking.deleteOne({ _id: args.bookingId })
			return event
		} catch (error) {
			throw error
		}
	}
}
