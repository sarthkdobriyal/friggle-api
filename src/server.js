const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/database');
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');
const adminRoutes = require('./routes/adminRoutes');
require('dotenv').config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONT_URL,
    'https://friggle-ui.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Friggle Backend API is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/admin', adminRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
