const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bookingSchema = new Schema(
	{
		event: {
			type: Schema.Types.ObjectId,
			ref: 'Event'
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	},
	{ timestamps: true }
)

const booking = mongoose.model('Booking', bookingSchema)

module.exports = booking
