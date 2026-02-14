const express = require('express');
const userRoute = require('./routes/users.route');
const blogRoute = require('./routes/blogs.route')

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

app.use('/api/v1/users', userRoute);
app.use('/api/v1/blogs', blogRoute);

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to my blogging API!');
});

// Wrong endpoints
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


module.exports = app;