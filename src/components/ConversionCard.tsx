import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, AlertCircle, Music, Clock, User } from 'lucide-react';
import type { VideoData } from '@/pages/Index';

interface ConversionCardProps {
  videoData?: VideoData;
  status: 'completed' | 'error';
  error?: string;
  onDownload: () => void;
  onReset: () => void;
}

export const ConversionCard = ({ 
  videoData, 
  status, 
  error, 
  onDownload, 
  onReset 
}: ConversionCardProps) => {
  if (status === 'error') {
    return (
      <Card className="glass-card p-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Conversion Failed</h3>
            <p className="text-muted-foreground mb-4">
              {error || 'An unexpected error occurred during conversion.'}
            </p>
          </div>
          <Button onClick={onReset} variant="outline" className="w-full max-w-xs">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (!videoData) return null;

  return (
    <Card className="glass-card overflow-hidden">
      <div className="md:flex">
        {/* Thumbnail */}
        <div className="md:w-80 md:flex-shrink-0">
          <div className="aspect-video md:aspect-square md:h-full relative overflow-hidden">
            <img
              src={videoData.thumbnail}
              alt={videoData.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <Badge className="absolute top-3 right-3 bg-black/50 text-white border-none">
              <Music className="w-3 h-3 mr-1" />
              MP3
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold leading-tight line-clamp-2 mb-2">
                {videoData.title}
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {videoData.channel}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {videoData.duration}
                </div>
              </div>
            </div>

            {/* Download Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <div className="font-medium">Ready for Download</div>
                  <div className="text-sm text-muted-foreground">
                    High quality MP3 • 320kbps • ~{Math.round(Math.random() * 3 + 3)}MB
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                  Ready
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={onDownload}
                  className="glow-button flex-1 h-12"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download MP3
                </Button>
                <Button 
                  onClick={onReset}
                  variant="outline"
                  className="h-12 border-border/50 hover:border-primary/50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Convert Another
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="pt-3 border-t border-border/30">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="font-medium text-foreground">Format</div>
                  <div className="text-muted-foreground">MP3</div>
                </div>
                <div>
                  <div className="font-medium text-foreground">Quality</div>
                  <div className="text-muted-foreground">320kbps</div>
                </div>
                <div>
                  <div className="font-medium text-foreground">Status</div>
                  <div className="text-green-400">Complete</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};