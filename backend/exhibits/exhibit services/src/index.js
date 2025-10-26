import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import boothRoutes from './routes/exhibitRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || process.env.BACKEND_EXHIBITS_SERVICE_PORT || 5003;

app.use(cors());
app.use(express.json());

// Routes
app.use('/exhibits', boothRoutes);

// Root route (before 404)
app.get('/', (req, res) => {
    res.send('Exhibit Service is running (Root Route)');
});

// Error handling middleware - add this after routes
app.use((req, res, next) => {
    res.status(404).json({
        message: `Exhibit ${req.url} not found`
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Export the app for testing and for a separate server startup script
export default app;