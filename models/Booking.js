const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  guests: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  username: { type: String, required: true },  // Add username field
});

module.exports = mongoose.model('Booking', bookingSchema);