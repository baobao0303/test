import express from 'express';
import { getContributions } from '../controllers/github.controller';

const router = express.Router();

router.get('/github/contributions', getContributions);

export default router;
