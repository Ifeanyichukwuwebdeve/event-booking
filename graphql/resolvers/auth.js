const bcrypt = require('bcryptjs')
const User = require('../../models/User')

module.exports = {
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
	}
}
