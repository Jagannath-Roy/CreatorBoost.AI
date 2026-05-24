import { Router } from 'express';
import { generateContent, getHistory, generateFromVideo, deleteHistoryItem, getUploadSignature } from '../controllers/content.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

router.route("/generate").post(generateContent);
router.route("/upload-signature").get(getUploadSignature);
router.route("/generate/video").post(generateFromVideo);
router.route("/history").get(getHistory);
router.route("/history/:id").delete(deleteHistoryItem);

export default router;
