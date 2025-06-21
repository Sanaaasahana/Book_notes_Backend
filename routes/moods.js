const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');

// @route   POST api/moods
// @desc    Record or update a user's mood for the current day
router.post('/', auth, async (req, res) => {
    const { mood } = req.body;
    const today = new Date().toISOString().slice(0, 10); // Get 'YYYY-MM-DD'

    if (!mood) {
        return res.status(400).json({ msg: 'Mood is required' });
    }

    try {
        // Use an "upsert" operation: Insert a new mood or update it if one already exists for today.
        // The UNIQUE constraint on (user_id, date) makes this safe.
        const query = `
            INSERT INTO moods (user_id, date, mood)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, date)
            DO UPDATE SET mood = $3
            RETURNING *;
        `;
        const result = await db.query(query, [req.user.id, today, mood]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/moods
// @desc    Get all moods for the authenticated user for a specific month
router.get('/', auth, async (req, res) => {
    const { year, month } = req.query; // Expects year=YYYY and month=MM (1-12)

    if (!year || !month) {
        return res.status(400).json({ msg: 'Year and month query parameters are required' });
    }
    
    try {
        const query = `
            SELECT mood, date FROM moods
            WHERE user_id = $1 AND EXTRACT(YEAR FROM date) = $2 AND EXTRACT(MONTH FROM date) = $3;
        `;
        const result = await db.query(query, [req.user.id, year, month]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 