import { YoutubeService, VideoMetadata } from './youtube.service';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

export interface ConversionJob {
  id: string;
  url: string;
  status: 'processing' | 'completed' | 'error';
  progress: number;
  metadata?: VideoMetadata;
  filePath?: string;
  fileId?: string;
  error?: string;
  createdAt: Date;
}

export class ConversionService {
  private jobs: Map<string, ConversionJob> = new Map();
  private files: Map<string, string> = new Map(); // fileId -> filePath
  private youtubeService = new YoutubeService();
  private tempDir = process.env.TEMP_DIR || './temp';

  async startConversion(jobId: string, url: string, quality: string = '320'): Promise<void> {
    const job: ConversionJob = {
      id: jobId,
      url,
      status: 'processing',
      progress: 0,
      createdAt: new Date()
    };

    this.jobs.set(jobId, job);

    try {
      // Update progress: Getting metadata
      job.progress = 20;
      this.jobs.set(jobId, { ...job });

      const metadata = await this.youtubeService.getVideoMetadata(url);
      job.metadata = metadata;
      job.progress = 40;
      this.jobs.set(jobId, { ...job });

      // Create job-specific directory
      const jobDir = path.join(this.tempDir, jobId);
      if (!fs.existsSync(jobDir)) {
        fs.mkdirSync(jobDir, { recursive: true });
      }

      // Update progress: Starting download
      job.progress = 60;
      this.jobs.set(jobId, { ...job });

      const filePath = await this.youtubeService.downloadAudio(url, jobDir, quality);
      
      // Generate file ID and store file path
      const fileId = uuidv4();
      this.files.set(fileId, filePath);

      // Update progress: Completed
      job.status = 'completed';
      job.progress = 100;
      job.filePath = filePath;
      job.fileId = fileId;
      this.jobs.set(jobId, { ...job });

    } catch (error) {
      console.error(`Conversion failed for job ${jobId}:`, error);
      job.status = 'error';
      job.error = error instanceof Error ? error.message : 'Unknown error occurred';
      this.jobs.set(jobId, { ...job });
    }
  }

  getJobStatus(jobId: string): ConversionJob | undefined {
    return this.jobs.get(jobId);
  }

  getFilePath(fileId: string): string | undefined {
    return this.files.get(fileId);
  }

  cleanup(): void {
    const now = new Date();
    const maxAge = parseInt(process.env.MAX_FILE_AGE || '3600000'); // 1 hour

    // Clean up old jobs
    for (const [jobId, job] of this.jobs.entries()) {
      if (now.getTime() - job.createdAt.getTime() > maxAge) {
        // Remove job directory
        const jobDir = path.join(this.tempDir, jobId);
        if (fs.existsSync(jobDir)) {
          fs.rmSync(jobDir, { recursive: true, force: true });
        }

        // Remove file mapping if exists
        if (job.fileId) {
          this.files.delete(job.fileId);
        }

        // Remove job
        this.jobs.delete(jobId);
      }
    }

    console.log(`Cleanup completed. Active jobs: ${this.jobs.size}, Active files: ${this.files.size}`);
  }
}