
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const userRoutes = require('./routes/users');
// const todoRoutes = require('./routes/todos');

// // Load environment variables
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(express.json());

// // Database connection
// const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:todayiwenttoRampally@8374@eeasyhr.uybpd.mongodb.net/mindful_todos';

// mongoose.connect(MONGO_URI)
//   .then(() => console.log('MongoDB connected successfully'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Routes
// app.use('/api/users', userRoutes);
// app.use('/api/todos', todoRoutes);

// // Health check route
// app.get('/', (req, res) => {
//   res.send('Mindful Todos API is running');
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/users');
const todoRoutes = require('./routes/todos');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:todayiwenttoRampally@8374@eeasyhr.uybpd.mongodb.net/mindful_todos?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Wait for 5s before failing
      socketTimeoutMS: 45000, // Increase socket timeout
    });

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // Stop the process if connection fails
  }
};

// Call the connection function
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Mindful Todos API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
