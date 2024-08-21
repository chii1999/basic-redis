// src/app.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoute');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize the app
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Middleware 
app.use(express.json()); // For parsing JSON bodies

// Routes
app.use('/api/users', userRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
