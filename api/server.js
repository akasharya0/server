const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const app = express.Router();


app.use(express.json());  


let users = []; 

// Register Route (POST /register)
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

 
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
 
  const hashedPassword = await bcrypt.hash(password, 10);

  
  users.push({ username, password: hashedPassword });
  console.log(username, password)
  res.status(201).json({ message: 'User registered successfully' });
});

// Login Route (POST /login)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

 
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }


  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '2h' });

  res.status(200).json({ token });
  console.log(token)
});

// Protected Route (GET /protected)
app.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'You have access to this protected route!' });
});

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];  // Get token from "Authorization" header

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    req.user = user;  // Store user info for use in protected routes
    next();
  });
}
module.exports= app;
