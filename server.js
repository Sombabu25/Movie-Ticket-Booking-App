const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/movieBooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Define User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', userSchema);

// Define booking schema
const bookingSchema = new mongoose.Schema({
  movie: String,
  name: String,
  seats: Number,
  date: String,
  duration: String,
  totalPrice: Number, // Add the totalPrice field
  userId: mongoose.Schema.Types.ObjectId, 
}, {
  timestamps: true
});


const Booking = mongoose.model('Booking', bookingSchema);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'movieBookingApp',
  resave: false,
  saveUninitialized: true,
}));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/movie', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'movie.html'));
});

app.get('/book', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'book.html'));
});

// Handle booking confirmation
app.post('/confirm-booking', async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  const { movie, name, seats, date, duration } = req.body;

  // Assuming a fixed price per seat, adjust as needed
  const pricePerSeat = 200; // Change this to the appropriate price logic
  const totalPrice = pricePerSeat * seats;

  try {
    const newBooking = new Booking({
      movie,
      name,
      seats,
      date,
      duration,
      userId: req.session.userId, // Associate booking with user
      totalPrice: totalPrice, // Add totalPrice field here
    });
    
    await newBooking.save();
    console.log("Booking saved:", newBooking);

    res.redirect('/profile');
  } catch (err) {

    
    console.error("Error saving booking:", err);
    res.status(500).send("Something went wrong. Please try again.");
  }
});



// Profile page
app.get('/profile', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// API to fetch bookings (used by profile page JS)
app.get('/api/bookings', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const bookings = await Booking.find({ userId: req.session.userId });
    res.json(bookings); // 'totalPrice' will be included automatically
  } catch (err) {
    console.error("Failed to fetch bookings:", err);
    res.status(500).json({ message: 'Error retrieving bookings' });
  }
});

  


// Registration route
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match.');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Something went wrong.');
  }
});

// Login route
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send('User not found.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials.');
    }

    req.session.userId = user._id; // Store userId in session
    res.redirect('/profile');
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send('Something went wrong.');
  }
});


// Logout (Sign out) route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could not log out. Please try again.");
    }
    res.redirect('/login'); // Redirect to login after logout
  });
});


// 404 Page
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
