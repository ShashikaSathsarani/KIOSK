-- Drop and recreate the database, then switch to it and (re)create the table.
drop database if exists feedbackdb;
create database feedbackdb;

-- Connect to the newly created database so the following commands operate inside it.
\connect feedbackdb

-- Ensure the table creation is idempotent: drop if it exists, then create.
drop table if exists feedbacks;
CREATE TABLE feedbacks (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  rating INT NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Show contents (should be empty after fresh create)
select * from feedbacks;
