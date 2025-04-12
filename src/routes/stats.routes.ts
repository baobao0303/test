import express from 'express';
import { getStats, postStats } from '../controllers/stats.controller';

const router = express.Router();

router.get('/stats', getStats); 
router.post('/stats', postStats); 

export default router;