import { Request, Response } from 'express';
import { YoutubeService } from '../services/youtube.service';
import { ConversionService } from '../services/conversion.service';
import { validateYoutubeUrl } from '../utils/validation';
import { v4 as uuidv4 } from 'uuid';

export class YoutubeController {
  private youtubeService = new YoutubeService();
  private conversionService = new ConversionService();

  convertVideo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { url, quality = '320' } = req.body;

      if (!url) {
        res.status(400).json({ error: 'YouTube URL is required' });
        return;
      }

      if (!validateYoutubeUrl(url)) {
        res.status(400).json({ error: 'Invalid YouTube URL' });
        return;
      }

      const jobId = uuidv4();
      
      // Start conversion process asynchronously
      this.conversionService.startConversion(jobId, url, quality);

      res.json({ 
        jobId, 
        message: 'Conversion started',
        status: 'processing'
      });
    } catch (error) {
      console.error('Convert video error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { jobId } = req.params;
      const status = this.conversionService.getJobStatus(jobId);

      if (!status) {
        res.status(404).json({ error: 'Job not found' });
        return;
      }

      res.json(status);
    } catch (error) {
      console.error('Get status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  downloadFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { fileId } = req.params;
      const filePath = this.conversionService.getFilePath(fileId);

      if (!filePath) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      res.download(filePath, (err) => {
        if (err) {
          console.error('Download error:', err);
          res.status(500).json({ error: 'Download failed' });
        }
      });
    } catch (error) {
      console.error('Download file error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getMetadata = async (req: Request, res: Response): Promise<void> => {
    try {
      const { url } = req.body;

      if (!url) {
        res.status(400).json({ error: 'YouTube URL is required' });
        return;
      }

      if (!validateYoutubeUrl(url)) {
        res.status(400).json({ error: 'Invalid YouTube URL' });
        return;
      }

      const metadata = await this.youtubeService.getVideoMetadata(url);
      res.json(metadata);
    } catch (error) {
      console.error('Get metadata error:', error);
      res.status(500).json({ error: 'Failed to fetch video metadata' });
    }
  };
}