const express = require('express');
const cors = require('cors');
require('./db.js'); // This will initialize the database connection

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Define a simple root route
app.get('/', (req, res) => {
  res.send('Mindful Wellness App Server is running!');
});

// Import and use routes
const userRoutes = require('./routes/users');
const journalRoutes = require('./routes/journal');
const moodRoutes = require('./routes/moods');
app.use('/api/users', userRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/moods', moodRoutes);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 