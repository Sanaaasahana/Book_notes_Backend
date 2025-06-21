-- This script contains the SQL commands to set up the database tables for the Mindful Wellness App.
-- You should run these commands in your NeonDB SQL editor.

-- First, create an extension for generating UUIDs if it doesn't exist.
-- This is often used for creating unique primary keys.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the 'users' table
-- This table will store user account information.
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    age INT,
    gender VARCHAR(50),
    bio TEXT,
    join_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    profile_complete BOOLEAN DEFAULT FALSE
);

-- Create the 'journal_entries' table
-- This table will store the journal entries created by users.
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) CHECK (category IN ('mindfulness', 'stress', 'personal-growth', 'gratitude', 'other')) DEFAULT 'other',
    is_public BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'moods' table
-- This table will store the daily mood entries for each user.
CREATE TABLE moods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mood VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT unique_mood_per_day UNIQUE (user_id, date)
);

-- You can add indexes for frequently queried columns to improve performance.
CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX idx_journal_entries_is_public ON journal_entries(is_public);

-- End of script. 