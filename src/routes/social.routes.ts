import express from 'express';
import { getSocialLinks, updateSocialLinks } from '../controllers/social.controller';

const router = express.Router();

router.get('/socials', getSocialLinks); 
router.put('/socials', updateSocialLinks);

export default router;