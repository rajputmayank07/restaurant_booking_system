require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.set('trust proxy', true);  // Necessary if using reverse proxies like Railway
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'none', 
      maxAge: 1000 * 60 * 60 * 24,  // 1 day
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.options('*', cors({
  origin: [/https:\/\/.*-netlify\.app$/, 'https://tangerine-mandazi-1cfef2.netlify.app'],
  credentials: true,
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// Static Files (Frontend)
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Server Start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
