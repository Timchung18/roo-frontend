-- Add UUID extension if not already installed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),  -- User's given name
    last_name VARCHAR(255),   -- User's family name
    email VARCHAR(255),       -- User's email address
    verification_id VARCHAR(255) NOT NULL,  -- Verification ID of the user object
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255),  -- Assuming file path storage
    type VARCHAR(50) NOT NULL,  -- 'public' or 'private'
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME,
    location_of_attendees_text TEXT,
    location_of_attendees_position TEXT,
    deadline_date DATE,
    funding_per_person DECIMAL,
    min_number_of_attendees INT,
    allow_more_attendees BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -- Create Invitations table
-- CREATE TABLE invitations (
--     id SERIAL PRIMARY KEY,
--     event_id INT REFERENCES events(id),
--     user_id INT REFERENCES users(id),
--     invited_user INT NOT NULL REFERENCES users(id),
--     invitation_code VARCHAR(255) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Create RSVP table
-- CREATE TABLE rsvp (
--     id SERIAL PRIMARY KEY,
--     event_id INT NOT NULL REFERENCES events(id),
--     status VARCHAR(10) NOT NULL CHECK (status IN ('yes', 'maybe', 'no')),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Create Auth table
-- CREATE TABLE auth (
--     id SERIAL PRIMARY KEY,
--     username VARCHAR(255) NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Create Phone Verifications table
-- CREATE TABLE phone_verifications (
--     id SERIAL PRIMARY KEY,
--     phone_number VARCHAR(255) NOT NULL,
--     verification_code VARCHAR(255) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
