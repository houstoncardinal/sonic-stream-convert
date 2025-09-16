import { useState } from 'react';
import { URLInput } from '@/components/URLInput';
import { ConversionCard } from '@/components/ConversionCard';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { useToast } from '@/hooks/use-toast';

export interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channel: string;
  url: string;
}

export interface ConversionState {
  status: 'idle' | 'converting' | 'completed' | 'error';
  progress: number;
  videoData?: VideoData;
  downloadUrl?: string;
  error?: string;
}

const Index = () => {
  const [conversionState, setConversionState] = useState<ConversionState>({
    status: 'idle',
    progress: 0,
  });
  const { toast } = useToast();

  const handleURLSubmit = async (url: string) => {
    if (!url || !isValidYouTubeURL(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube video URL.",
        variant: "destructive",
      });
      return;
    }

    setConversionState({
      status: 'converting',
      progress: 0,
    });

    try {
      // Simulate conversion process for demo
      await simulateConversion(url, setConversionState);
    } catch (error) {
      setConversionState({
        status: 'error',
        progress: 0,
        error: 'Failed to convert video. Please try again.',
      });
      toast({
        title: "Conversion Failed",
        description: "There was an error converting your video. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (conversionState.downloadUrl) {
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = conversionState.downloadUrl;
      link.download = `${conversionState.videoData?.title || 'audio'}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your MP3 file is downloading now.",
      });
    }
  };

  const handleReset = () => {
    setConversionState({
      status: 'idle',
      progress: 0,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            YouTube to MP3 Converter
          </h1>
          <p className="text-muted-foreground text-center mt-2">
            Convert YouTube videos to high-quality MP3 files
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* URL Input Section */}
          <section className="animate-fade-in">
            <URLInput 
              onSubmit={handleURLSubmit}
              disabled={conversionState.status === 'converting'}
            />
          </section>

          {/* Progress Indicator */}
          {conversionState.status === 'converting' && (
            <section className="animate-scale-in">
              <ProgressIndicator 
                progress={conversionState.progress}
                status="Converting your video..."
              />
            </section>
          )}

          {/* Conversion Result */}
          {(conversionState.status === 'completed' || conversionState.status === 'error') && (
            <section className="animate-scale-in">
              <ConversionCard
                videoData={conversionState.videoData}
                status={conversionState.status}
                error={conversionState.error}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">Fast, secure, and free YouTube to MP3 conversion</p>
            <p className="text-sm">No registration required • Privacy-focused • High quality audio</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper function to validate YouTube URLs
const isValidYouTubeURL = (url: string): boolean => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w-]+/;
  return youtubeRegex.test(url);
};

// Simulate conversion process for demo
const simulateConversion = async (
  url: string, 
  setConversionState: React.Dispatch<React.SetStateAction<ConversionState>>
): Promise<void> => {
  // Extract video ID for demo
  const videoId = extractVideoId(url);
  
  // Simulate progress updates
  const progressSteps = [
    { progress: 20, delay: 500 },
    { progress: 45, delay: 800 },
    { progress: 70, delay: 600 },
    { progress: 90, delay: 400 },
    { progress: 100, delay: 300 },
  ];

  for (const step of progressSteps) {
    await new Promise(resolve => setTimeout(resolve, step.delay));
    setConversionState(prev => ({
      ...prev,
      progress: step.progress,
    }));
  }

  // Simulate completed conversion with mock data
  setConversionState({
    status: 'completed',
    progress: 100,
    videoData: {
      id: videoId,
      title: "Sample YouTube Video",
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      duration: "3:45",
      channel: "Sample Channel",
      url: url,
    },
    downloadUrl: "#", // In real app, this would be the actual MP3 file URL
  });
};

// Extract video ID from YouTube URL
const extractVideoId = (url: string): string => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : 'dQw4w9WgXcQ'; // Fallback to Rick Roll ID
};

export default Index;