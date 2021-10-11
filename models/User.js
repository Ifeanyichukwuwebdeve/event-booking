const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema ({
  email: {
    type: String,
    required: true
    // unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event'
    }
  ]
})

const user = mongoose.model('User', userSchema)
module.exports = user