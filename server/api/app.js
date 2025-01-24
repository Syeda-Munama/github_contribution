
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo');
const authRoutes = require('../routes/auth');
const contributionRoutes = require('../routes/contribution');
const setReminderRoutes = require('../routes/reminder');
const storeTokenRoutes = require('../routes/storeToken');
const startScheduler = require('../config/scheduler');
require('../config/passport'); 

const app = express();

// Serve static files
app.use(express.static('src'));

startScheduler();


app.use(
  cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
  })
);

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || '4b6b96a141a1dc372551c05aa536f4f47f86675b',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:"mongodb+srv://milliedesigns66:munama@me-cluster.1zsgy.mongodb.net/?retryWrites=true&w=majority&appName=ME-Cluster",
      collectionName: 'sessions', 
    }),//mongodb+srv://EmadKhan:Seemal123@khantodo,6wnfk31.mongodb.net/
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true, // Secure cookies
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/contributions', contributionRoutes);
app.use('/reminder', setReminderRoutes)
app.use('/token', storeTokenRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
