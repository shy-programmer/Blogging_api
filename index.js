const connectDB = require('./config/database');
const dotenv = require('dotenv').config;
const PORT = process.env.PORT || 3000;
const app = require('./app');


// Connect to the database
connectDB();


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





