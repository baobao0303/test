import express from 'express';
import { 
    updateSkills, 
    updateExperience, 
    updateProjects, 
    updateEducation,
    updateFeaturedProjects,
    updateOpenToOpportunities, 
} from '../controllers/use.controller';
import { updateDescription, updateAvatar } from '../controllers/use.controller';
import { getUserInfo } from '../controllers/use.controller';
import multer from 'multer';

const router = express.Router();

// Configure multer storage
const upload = multer({ dest: 'uploads/' });

router.put('/skills/:id', updateSkills);
router.put('/experience/:id', updateExperience);
router.put('/projects/:id', updateProjects);
router.put('/education/:id', updateEducation);
router.put('/profile/description/:id', updateDescription);
router.put('/featuredProjects/:id', updateFeaturedProjects);
router.put('/profile/avatar/:id', upload.single('avatar'), updateAvatar);
router.put('/openToOpportunities/:id', updateOpenToOpportunities); 
router.get('/', getUserInfo);

export default router;