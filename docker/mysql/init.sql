-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS expanders360;

-- Use the database
USE expanders360;

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON expanders360.* TO 'expanders_user'@'%';
FLUSH PRIVILEGES;

-- Create some sample data (optional)
-- This will be populated by TypeORM migrations and seeders
