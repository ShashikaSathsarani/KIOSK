import express from 'express';
import exhibitController from '../controllers/exhibitController.js';

const router = express.Router();

// Get all exhibits
router.get('/', exhibitController.getExhibits);

// Get exhibit by Tag
router.get('/:tag', exhibitController.getExhibitByTag);

export default router;