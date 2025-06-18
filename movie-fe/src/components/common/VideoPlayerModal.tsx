import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string | null;
  title?: string;
}

// Helper to convert youtube.com/watch?v=... to youtube.com/embed/...
const getEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.includes('watch')) {
      const videoId = urlObj.searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (urlObj.hostname.includes('youtu.be')) {
      const videoId = urlObj.pathname.slice(1);
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    // Return the original url if it's already an embed link or a different host
    return url;
  } catch (error) {
    console.error("Invalid URL for embedding:", url);
    return null;
  }
}

export function VideoPlayerModal({ isOpen, onClose, videoUrl, title }: VideoPlayerModalProps) {
  if (!isOpen || !videoUrl) return null;

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-none sm:max-w-none w-5/7 h-auto aspect-video p-0">
        <DialogHeader className="p-4 absolute top-0 left-0 bg-gradient-to-b from-black/70 to-transparent w-full">
          <DialogTitle className="text-white">{title || 'Video Player'}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video">
          {embedUrl ? (
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title={title || 'Video Player'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-none"
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full bg-black text-white">
              <p>Invalid or unsupported video URL.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 