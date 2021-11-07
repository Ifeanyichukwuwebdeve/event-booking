const Booking = require('../../models/Booking')
const Event = require('../../models/Event')
const { userFun, singleEvent } = require('./merge')
const { dateToString } = require('../../helpers/date')

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
			const event = singleEvent(booking.event._id)
			await Booking.deleteOne({ _id: args.bookingId })
			return event
		} catch (error) {
			throw error
		}
	}
}
