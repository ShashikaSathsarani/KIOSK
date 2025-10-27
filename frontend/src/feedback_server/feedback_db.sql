
create database feedbackdb;

CREATE TABLE feedbacks (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  rating INT NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from feedbacks;
