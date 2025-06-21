const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');

// @route   GET api/journal
// @desc    Get all journal entries for a user
router.get('/', auth, async (req, res) => {
    try {
        const entries = await db.query(
            'SELECT * FROM journal_entries WHERE user_id = $1 ORDER BY timestamp DESC',
            [req.user.id]
        );
        res.json(entries.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/journal
// @desc    Create a new journal entry
router.post('/', auth, async (req, res) => {
    const { content, category, isPublic } = req.body;
    try {
        // First, get the current user's name
        const userResult = await db.query('SELECT name FROM users WHERE id = $1', [req.user.id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const userName = userResult.rows[0].name;

        // Now, create the new journal entry
        const newEntry = await db.query(
            'INSERT INTO journal_entries (user_id, user_name, content, category, is_public) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.user.id, userName, content, category, isPublic]
        );

        res.status(201).json(newEntry.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/journal/public
// @desc    Get all public journal entries
router.get('/public', async (req, res) => {
    try {
        const entries = await db.query(
            "SELECT * FROM journal_entries WHERE is_public = true ORDER BY timestamp DESC"
        );
        res.json(entries.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 