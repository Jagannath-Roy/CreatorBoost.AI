import { Router } from 'express';
import { generateContent, getHistory } from '../controllers/content.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

router.route("/generate").post(generateContent);
router.route("/history").get(getHistory);

export default router;
