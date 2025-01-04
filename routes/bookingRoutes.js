const express = require('express');
const { createBooking, getBookings, getUserBookings, deleteBooking } = require('../controllers/bookingController');
const router = express.Router();
const passport = require('passport');

router.post('/', createBooking);  // Public route with username from request body
router.get('/', getBookings);  // Fetch all bookings for a date
router.get('/user', passport.authenticate('session', { session: true }), getUserBookings);  // Authenticated user's bookings
router.delete('/:id', passport.authenticate('session', { session: true }), deleteBooking);  // Authenticated user can delete
module.exports = router;
