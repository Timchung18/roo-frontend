-- Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),  -- User's given name
    last_name VARCHAR(255),   -- User's family name
    email VARCHAR(255),       -- User's email address
    verification_id VARCHAR(255) NOT NULL,  -- Verification ID of the user object
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restaurants Table
CREATE TABLE restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    owner_user_id INT NOT NULL REFERENCES users(user_id),
    address TEXT NOT NULL,
    description TEXT,
    hour_open TIME NOT NULL,
    hour_closed TIME NOT NULL,
    rating DECIMAL(3, 1),
    name VARCHAR(100) NOT NULL,
    cuisine VARCHAR(50),
    price_per_seat DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tables Table
CREATE TABLE tables (
    table_id SERIAL PRIMARY KEY,
    restaurant_id INT NOT NULL REFERENCES restaurants(restaurant_id),
    min_number_of_seats INT NOT NULL,
    max_number_of_seats INT NOT NULL,
    table_number VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    host_user_id INT NOT NULL REFERENCES users(user_id),
    number_of_seats_taken INT NOT NULL,
    table_id INT NOT NULL REFERENCES tables(table_id),
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Joiners Table
CREATE TABLE joiners (
    joiner_id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES events(event_id),
    joiner_user_id INT NOT NULL REFERENCES users(user_id)
);

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for restaurants table
CREATE TRIGGER update_restaurants_updated_at
BEFORE UPDATE ON restaurants
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for tables table
CREATE TRIGGER update_tables_updated_at
BEFORE UPDATE ON tables
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for events table
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
