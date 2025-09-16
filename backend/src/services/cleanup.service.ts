import { ConversionService } from './conversion.service';

const conversionService = new ConversionService();

export function startCleanupService(): void {
  const interval = parseInt(process.env.CLEANUP_INTERVAL || '3600000'); // 1 hour
  
  console.log(`Starting cleanup service with interval: ${interval}ms`);
  
  setInterval(() => {
    console.log('Running cleanup...');
    conversionService.cleanup();
  }, interval);

  // Run initial cleanup
  setTimeout(() => {
    conversionService.cleanup();
  }, 10000); // Wait 10 seconds after startup
}