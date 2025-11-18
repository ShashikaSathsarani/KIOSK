const express = require('express');
const cors = require('cors');
const supabase = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.KB_API_PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * POST /api/knowledge-base/query
 * Main endpoint used by chatbot - searches knowledge base by query
 */
app.post('/api/knowledge-base/query', async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Query parameter is required'
            });
        }

        // Extract keywords from query
        const keywords = query.toLowerCase()
            .split(' ')
            .filter(word => word.length > 2);

        // Search database using keywords - include category and subcategory
        const { data, error } = await supabase
            .from('knowledge_base')
            .select('*')
            .eq('is_active', true)
            .or(
                keywords.map(keyword => 
                    `title.ilike.%${keyword}%,content.ilike.%${keyword}%,category.ilike.%${keyword}%,subcategory.ilike.%${keyword}%`
                ).join(',')
            )
            .order('priority', { ascending: false })
            .limit(15);

        if (error) throw error;

        res.json({
            success: true,
            count: data.length,
            data: data
        });
    } catch (error) {
        console.error('Query error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'EngEx Knowledge Base API is running',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
    console.log(`EngEx Knowledge Base API running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Connected to Supabase database`);
});

module.exports = app;


