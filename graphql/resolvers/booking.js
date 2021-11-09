const Booking = require('../../models/Booking')
const Event = require('../../models/Event')
const { singleEvent, populateBooking } = require('./merge')
const { dateToString } = require('../../helpers/date')

module.exports = {
	bookings: async (args, req) => {
		// if (!req.isAuth) throw new Error('Unauthenticated')
		try {
			const bookings = await Booking.find()
			return bookings.map((booking) => {
				return populateBooking(booking)
			})
		} catch (error) {
			throw error
		}
	},
	bookEvent: async (args, req) => {
		if (!req.isAuth) throw new Error('Unauthenticated')
		try {
			const fetchedEvent = await Event.findById(args.eventId)
			if (!fetchedEvent) {
				const error = new Error('Event not found or has been deleted!!')
				throw error
			}
			const booking = new Booking({
				user: req.userId,
				event: fetchedEvent
			})
			const result = await booking.save()
			return populateBooking(result)
		} catch (error) {
			throw error
		}
	},
	cancelBooking: async (args, req) => {
		if (!req.isAuth) throw new Error('Unauthenticated')
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
