// db.js
// Helper module that creates and exports a Supabase client configured
// from environment variables. This keeps database connection logic
// in one place so other server modules can import the ready-to-use
// client.

// Import the Supabase client factory
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from a .env file when running locally.
// This will populate process.env.SUPABASE_URL and
// process.env.SUPABASE_SERVICE_KEY used below.
require('dotenv').config();

// Create Supabase client for the chatbot knowledge base.
// We intentionally use the SERVICE_KEY here (server-side secret)
// so the server can perform privileged reads/writes. Never expose
// this key to the browser or client-side code.
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// Export the configured client so other modules can do:
// const supabase = require('./db')
module.exports = supabase;
