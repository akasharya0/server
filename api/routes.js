const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Import the routes
const authRoutes = require('./server');
const bookRoutes = require('./index');

// Use the routes
app.use('/app', bookRoutes);  // All book-related routes will now be prefixed with /app
app.use('/auth', authRoutes); // All auth-related routes will now be prefixed with /auth

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
