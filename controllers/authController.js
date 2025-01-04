const User = require('../models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) return done(null, false, { message: 'Incorrect username' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return done(null, false, { message: 'Incorrect password' });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ message: 'Error during signup', error: err.message });
  }
};

const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json({ message: 'Server error during login' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: 'Error during session creation' });
      res.status(200).json({ message: 'Login successful', user });
    });
  })(req, res, next);
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Error during logout' });
    res.status(200).json({ message: 'Logout successful' });
  });
};

module.exports = { signup, login, logout };
