import { spawn } from 'child_process';
import path from 'path';

export interface VideoMetadata {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  channel: string;
  description?: string;
  viewCount?: number;
  uploadDate?: string;
}

export class YoutubeService {
  async getVideoMetadata(url: string): Promise<VideoMetadata> {
    return new Promise((resolve, reject) => {
      const ytdlp = spawn('yt-dlp', [
        '--print', '%(id)s|%(title)s|%(thumbnail)s|%(duration)s|%(channel)s|%(description)s|%(view_count)s|%(upload_date)s',
        '--no-warnings',
        url
      ]);

      let output = '';
      let error = '';

      ytdlp.stdout.on('data', (data) => {
        output += data.toString();
      });

      ytdlp.stderr.on('data', (data) => {
        error += data.toString();
      });

      ytdlp.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`yt-dlp failed: ${error}`));
          return;
        }

        try {
          const [id, title, thumbnail, duration, channel, description, viewCount, uploadDate] = output.trim().split('|');
          
          resolve({
            id,
            title: title || 'Unknown Title',
            thumbnail: thumbnail || '',
            duration: parseInt(duration) || 0,
            channel: channel || 'Unknown Channel',
            description: description || '',
            viewCount: parseInt(viewCount) || 0,
            uploadDate: uploadDate || ''
          });
        } catch (parseError) {
          reject(new Error(`Failed to parse metadata: ${parseError}`));
        }
      });
    });
  }

  async downloadAudio(url: string, outputPath: string, quality: string = '320'): Promise<string> {
    return new Promise((resolve, reject) => {
      const outputFile = path.join(outputPath, '%(title)s.%(ext)s');
      
      const ytdlp = spawn('yt-dlp', [
        '--extract-audio',
        '--audio-format', 'mp3',
        '--audio-quality', quality,
        '--output', outputFile,
        '--no-warnings',
        '--embed-metadata',
        '--add-metadata',
        url
      ]);

      let output = '';
      let error = '';

      ytdlp.stdout.on('data', (data) => {
        output += data.toString();
      });

      ytdlp.stderr.on('data', (data) => {
        error += data.toString();
      });

      ytdlp.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`yt-dlp failed: ${error}`));
          return;
        }

        // Find the downloaded file
        const fs = require('fs');
        const files = fs.readdirSync(outputPath).filter((file: string) => file.endsWith('.mp3'));
        
        if (files.length === 0) {
          reject(new Error('No MP3 file found after conversion'));
          return;
        }

        const downloadedFile = path.join(outputPath, files[0]);
        resolve(downloadedFile);
      });
    });
  }

  isYtDlpAvailable(): Promise<boolean> {
    return new Promise((resolve) => {
      const ytdlp = spawn('yt-dlp', ['--version']);
      
      ytdlp.on('close', (code) => {
        resolve(code === 0);
      });

      ytdlp.on('error', () => {
        resolve(false);
      });
    });
  }
}