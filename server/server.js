const express = require('express');
const { connectDB } = require('./config/db');
const cors = require('cors');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const pollRoutes = require('./routes/polls');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const getRealIp = require('./middleware/getIp');

require('dotenv').config({
  path: process.env.NODE_ENV === 'production' 
    ? '.env.production' 
    : '.env.development'
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(getRealIp);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});