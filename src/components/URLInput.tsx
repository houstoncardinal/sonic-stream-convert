import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Download, Link, Loader2 } from 'lucide-react';

interface URLInputProps {
  onSubmit: (url: string) => void;
  disabled?: boolean;
}

export const URLInput = ({ onSubmit, disabled = false }: URLInputProps) => {
  const [url, setUrl] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedUrl = e.dataTransfer.getData('text');
    if (droppedUrl) {
      setUrl(droppedUrl);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  return (
    <Card className={`glass-card p-8 drag-zone ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Download className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Convert YouTube Video</h2>
        <p className="text-muted-foreground">
          Paste a YouTube URL below or drag and drop a link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={disabled}
            className="pl-10 h-12 text-base bg-input/50 border-border/50 focus:border-primary/50 transition-colors"
          />
        </div>
        
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={!url.trim() || disabled}
            className="glow-button flex-1 h-12 text-base font-medium"
          >
            {disabled ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Convert to MP3
              </>
            )}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handlePaste}
            disabled={disabled}
            className="h-12 px-4 border-border/50 hover:border-primary/50 transition-colors"
          >
            Paste
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-border/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground text-center">
          <div>
            <div className="font-medium text-foreground">High Quality</div>
            <div>320kbps MP3</div>
          </div>
          <div>
            <div className="font-medium text-foreground">Fast</div>
            <div>Quick conversion</div>
          </div>
          <div>
            <div className="font-medium text-foreground">Secure</div>
            <div>Privacy focused</div>
          </div>
          <div>
            <div className="font-medium text-foreground">Free</div>
            <div>No limits</div>
          </div>
        </div>
      </div>
    </Card>
  );
};