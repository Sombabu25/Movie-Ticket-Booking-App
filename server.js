const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();

// ======================================================
// Connect to MongoDB
// ======================================================

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });


// ======================================================
// User Schema
// ======================================================

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
});

const User = mongoose.model('User', userSchema);


// ======================================================
// Booking Schema
// ======================================================

const bookingSchema = new mongoose.Schema({
  movie: String,
  name: String,
  seats: Number,
  date: String,
  duration: String,
  totalPrice: Number,
  userId: mongoose.Schema.Types.ObjectId,
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);


// ======================================================
// Middleware
// ======================================================

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({
  extended: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));


// ======================================================
// Routes - Pages
// ======================================================

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Movie page
app.get('/movie', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'movie.html'));
});

// Booking page
app.get('/book', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'book.html'));
});


// ======================================================
// Booking Confirmation
// ======================================================

app.post('/confirm-booking', async (req, res) => {

  if (!req.session.userId) {
    return res.redirect('/login');
  }

  const {
    movie,
    name,
    seats,
    date,
    duration
  } = req.body;

  // Fixed price per seat
  const pricePerSeat = 200;

  const totalPrice = pricePerSeat * seats;

  try {

    const newBooking = new Booking({
      movie,
      name,
      seats,
      date,
      duration,
      userId: req.session.userId,
      totalPrice: totalPrice,
    });

    await newBooking.save();

    console.log('Booking saved:', newBooking);

    res.redirect('/profile');

  } catch (err) {

    console.error('Error saving booking:', err);

    res.status(500).send(
      'Something went wrong. Please try again.'
    );
  }
});


// ======================================================
// Profile Page
// ======================================================

app.get('/profile', (req, res) => {

  if (!req.session.userId) {
    return res.redirect('/login');
  }

  res.sendFile(
    path.join(__dirname, 'public', 'profile.html')
  );
});


// ======================================================
// API - Fetch User Bookings
// ======================================================

app.get('/api/bookings', async (req, res) => {

  if (!req.session.userId) {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }

  try {

    const bookings = await Booking.find({
      userId: req.session.userId
    });

    res.json(bookings);

  } catch (err) {

    console.error(
      'Failed to fetch bookings:',
      err
    );

    res.status(500).json({
      message: 'Error retrieving bookings'
    });
  }
});


// ======================================================
// Registration Page
// ======================================================

app.get('/register', (req, res) => {

  res.sendFile(
    path.join(__dirname, 'public', 'register.html')
  );
});


// ======================================================
// Registration
// ======================================================

app.post('/register', async (req, res) => {

  const {
    name,
    email,
    password,
    confirmPassword
  } = req.body;

  if (password !== confirmPassword) {

    return res.status(400).send(
      'Passwords do not match.'
    );
  }

  try {

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.redirect('/login');

  } catch (err) {

    console.error(
      'Error during registration:',
      err
    );

    res.status(500).send(
      'Something went wrong.'
    );
  }
});


// ======================================================
// Login Page
// ======================================================

app.get('/login', (req, res) => {

  res.sendFile(
    path.join(__dirname, 'public', 'login.html')
  );
});


// ======================================================
// Login
// ======================================================

app.post('/login', async (req, res) => {

  const {
    email,
    password
  } = req.body;

  try {

    const user = await User.findOne({
      email
    });

    if (!user) {

      return res.status(400).send(
        'User not found.'
      );
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).send(
        'Invalid credentials.'
      );
    }

    // Store user ID in session
    req.session.userId = user._id;

    res.redirect('/profile');

  } catch (err) {

    console.error(
      'Error during login:',
      err
    );

    res.status(500).send(
      'Something went wrong.'
    );
  }
});


// ======================================================
// Logout
// ======================================================

app.get('/logout', (req, res) => {

  req.session.destroy((err) => {

    if (err) {

      return res.status(500).send(
        'Could not log out. Please try again.'
      );
    }

    res.redirect('/login');
  });
});


// ======================================================
// 404 Page
// ======================================================

app.use((req, res) => {

  res.status(404).sendFile(
    path.join(
      __dirname,
      'public',
      '404.html'
    )
  );
});


// ======================================================
// Start Server
// ======================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});
