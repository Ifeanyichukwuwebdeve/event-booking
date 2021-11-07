const authResolver = require('./auth')
const eventsResolver = require('./event')
const bookingResolver = require('./booking')

const rootResolver = {
	...authResolver,
	...eventsResolver,
	...bookingResolver
}

module.exports = rootResolver
