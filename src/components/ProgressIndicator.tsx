import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Download } from 'lucide-react';

interface ProgressIndicatorProps {
  progress: number;
  status: string;
}

export const ProgressIndicator = ({ progress, status }: ProgressIndicatorProps) => {
  return (
    <Card className="glass-card p-6">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{status}</h3>
          <p className="text-muted-foreground">
            Please wait while we process your video...
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-3">
          <Progress 
            value={progress} 
            className="h-2 bg-secondary/50"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{progress}% complete</span>
            <span>
              {progress < 25 && 'Fetching video...'}
              {progress >= 25 && progress < 50 && 'Extracting audio...'}
              {progress >= 50 && progress < 75 && 'Converting to MP3...'}
              {progress >= 75 && progress < 100 && 'Finalizing...'}
              {progress >= 100 && 'Complete!'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30 text-sm">
          <div className="text-center">
            <div className="font-medium text-foreground">Quality</div>
            <div className="text-muted-foreground">320kbps</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-foreground">Format</div>
            <div className="text-muted-foreground">MP3</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-foreground">Speed</div>
            <div className="text-muted-foreground">Fast</div>
          </div>
        </div>
      </div>
    </Card>
  );
};