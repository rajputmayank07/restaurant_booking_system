const Booking = require('../models/Booking');

// Create a new booking
const createBooking = async (req, res) => {
  const { name, contact, guests, date, time, username } = req.body;  // Make sure username is received

  if (!username) {
    return res.status(400).json({ message: 'User is not authenticated' });
  }

  try {
    // Check if the time slot is already booked for the given date
    const existingBooking = await Booking.findOne({ date, time });
    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked.' });
    }

    const newBooking = new Booking({ name, contact, guests, date, time, username });
    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all bookings for a specific date
const getBookings = async (req, res) => {
  const { date } = req.query;
  try {
    const query = date ? { date } : {};
    const bookings = await Booking.find(query).sort({ time: 1 });
    res.status(200).json(bookings);
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get bookings for the logged-in user
const getUserBookings = async (req, res) => {
  const username = req.user?.username;  // Assume req.user contains the authenticated user
  if (!username) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  try {
    const bookings = await Booking.find({ username }).sort({ date: 1, time: 1 });
    res.status(200).json(bookings);
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a booking by ID
const deleteBooking = async (req, res) => {
  const { id } = req.params;
  const username = req.user?.username || req.body.username;  // Ensure username is retrieved

  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.username !== username) {
      return res.status(403).json({ message: 'You are not authorized to cancel this booking.' });
    }

    await booking.deleteOne();  // Correct way to delete
    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (err) {
    console.error('Error canceling booking:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};


// Export the functions
module.exports = {
  createBooking,
  getBookings,
  getUserBookings,
  deleteBooking,
};
