import express from 'express';
import { signIn, signUp } from '../controllers/auth.controller';

const router = express.Router();

router.post('/signin', signIn);
router.post('/signup', signUp);

export default router;