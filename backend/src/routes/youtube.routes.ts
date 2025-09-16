import { Router } from 'express';
import { YoutubeController } from '../controllers/youtube.controller';

const router = Router();
const youtubeController = new YoutubeController();

// Convert YouTube video to MP3
router.post('/convert', youtubeController.convertVideo);

// Get conversion status
router.get('/status/:jobId', youtubeController.getStatus);

// Download converted MP3
router.get('/download/:fileId', youtubeController.downloadFile);

// Get video metadata
router.post('/metadata', youtubeController.getMetadata);

export { router as youtubeRoutes };