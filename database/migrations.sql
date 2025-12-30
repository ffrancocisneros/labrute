-- LaBrute Database Schema for PostgreSQL
-- Version 1.0

-- Drop tables if they exist (for fresh start)
DROP TABLE IF EXISTS fight_log CASCADE;
DROP TABLE IF EXISTS fights CASCADE;
DROP TABLE IF EXISTS brute_skills CASCADE;
DROP TABLE IF EXISTS brute_weapons CASCADE;
DROP TABLE IF EXISTS brutes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Index for faster login lookups
CREATE INDEX idx_users_username ON users(username);

-- Brutes table (the fighters)
CREATE TABLE brutes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    identifier BIGINT NOT NULL,
    experience INTEGER DEFAULT 1,
    level INTEGER DEFAULT 1,
    -- Base stats
    health INTEGER DEFAULT 50,
    strength INTEGER DEFAULT 2,
    agility INTEGER DEFAULT 2,
    speed INTEGER DEFAULT 2,
    armor INTEGER DEFAULT 2,
    endurance INTEGER DEFAULT 3,
    initiative INTEGER DEFAULT 0,
    -- Calculated values (stored for quick access)
    max_receivable_damages INTEGER DEFAULT 50,
    -- Metadata
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    fights_today INTEGER DEFAULT 0,
    last_fight_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Each user can only have one brute with the same name
    UNIQUE(user_id, name)
);

-- Index for user's brutes lookup
CREATE INDEX idx_brutes_user_id ON brutes(user_id);
CREATE INDEX idx_brutes_name ON brutes(name);

-- Skills available in the game
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    alias VARCHAR(50) UNIQUE NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_es VARCHAR(100),
    name_fr VARCHAR(100),
    description TEXT,
    effect_type VARCHAR(50), -- 'passive', 'active', 'talent', 'super'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default skills
INSERT INTO skills (alias, name_en, name_es, name_fr, effect_type) VALUES
    ('armor', 'Armor', 'Armadura', 'Armure', 'passive'),
    ('firstStrike', 'First Strike', 'Primer Golpe', 'Premier Coup', 'passive'),
    ('immortality', 'Immortality', 'Inmortalidad', 'Immortalité', 'passive'),
    ('resistant', 'Resistant', 'Resistente', 'Résistant', 'passive'),
    ('toughenedSkin', 'Toughened Skin', 'Piel Dura', 'Peau Dure', 'passive'),
    ('vitality', 'Vitality', 'Vitalidad', 'Vitalité', 'passive');

-- Brute skills (many-to-many relationship)
CREATE TABLE brute_skills (
    id SERIAL PRIMARY KEY,
    brute_id INTEGER NOT NULL REFERENCES brutes(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    level INTEGER DEFAULT 1,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(brute_id, skill_id)
);

CREATE INDEX idx_brute_skills_brute_id ON brute_skills(brute_id);

-- Weapons available in the game (loaded from JSON, but stored for reference)
CREATE TABLE weapons (
    id SERIAL PRIMARY KEY,
    alias VARCHAR(50) UNIQUE NOT NULL,
    name_en VARCHAR(100),
    name_es VARCHAR(100),
    name_fr VARCHAR(100),
    type VARCHAR(50), -- 'fast', 'heavy', 'long', 'thrown', 'sharp'
    damage_min INTEGER,
    damage_max INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Brute weapons (many-to-many relationship)
CREATE TABLE brute_weapons (
    id SERIAL PRIMARY KEY,
    brute_id INTEGER NOT NULL REFERENCES brutes(id) ON DELETE CASCADE,
    weapon_id INTEGER NOT NULL REFERENCES weapons(id) ON DELETE CASCADE,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(brute_id, weapon_id)
);

CREATE INDEX idx_brute_weapons_brute_id ON brute_weapons(brute_id);

-- Fights history
CREATE TABLE fights (
    id SERIAL PRIMARY KEY,
    brute1_id INTEGER NOT NULL REFERENCES brutes(id) ON DELETE SET NULL,
    brute2_id INTEGER NOT NULL REFERENCES brutes(id) ON DELETE SET NULL,
    winner_id INTEGER REFERENCES brutes(id) ON DELETE SET NULL,
    -- Store the fight seed for replay
    fight_seed BIGINT,
    -- Stats at time of fight (for replay accuracy)
    brute1_stats JSONB,
    brute2_stats JSONB,
    -- Fight log stored as JSON
    fight_log JSONB,
    -- Experience gained
    winner_exp_gained INTEGER DEFAULT 0,
    loser_exp_gained INTEGER DEFAULT 0,
    -- Metadata
    duration_hits INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fights_brute1_id ON fights(brute1_id);
CREATE INDEX idx_fights_brute2_id ON fights(brute2_id);
CREATE INDEX idx_fights_winner_id ON fights(winner_id);
CREATE INDEX idx_fights_created_at ON fights(created_at);

-- Sessions table for authentication
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_valid BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for brutes table
CREATE TRIGGER update_brutes_updated_at
    BEFORE UPDATE ON brutes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


