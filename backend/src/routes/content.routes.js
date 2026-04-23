import { Router } from 'express';
import { generateContent, getHistory, generateFromVideo } from '../controllers/content.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

router.route("/generate").post(generateContent);
router.route("/generate/video").post(upload.single("video"), generateFromVideo);
router.route("/history").get(getHistory);

export default router;
