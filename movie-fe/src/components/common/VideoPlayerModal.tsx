import { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { History } from '@/types/history';
import type { UseMutateFunction } from '@tanstack/react-query';

interface UpdateHistoryPayload {
  movieId: string;
  progress?: number;
  isFinished?: boolean;
}

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string | null;
  title?: string;
  movieId?: string;
  onProgressUpdate?: UseMutateFunction<History, Error, UpdateHistoryPayload, unknown>;
}

// Helper to check if a URL is from YouTube
const isYouTubeUrl = (url: string): boolean => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
};

// Helper to get video ID from YouTube URL
const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    let videoId: string | null = null;
    if (urlObj.hostname.includes('youtube.com')) {
      // Handles standard links (youtube.com/watch?v=...) and embed links
      videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/embed/')[1]?.split('?')[0];
    } else if (urlObj.hostname.includes('youtu.be')) {
      // Handles shortened links (youtu.be/...)
      videoId = urlObj.pathname.slice(1);
    }
    return videoId;
  } catch (error) {
    console.error("Could not parse YouTube URL:", url, error);
    return null;
  }
}

export function VideoPlayerModal({ 
  isOpen, 
  onClose, 
  videoUrl, 
  title, 
  movieId, 
  onProgressUpdate 
}: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null);

  const canTrackDirectVideo = movieId && onProgressUpdate && videoUrl && !isYouTubeUrl(videoUrl);
  const youTubeVideoId = videoUrl && isYouTubeUrl(videoUrl) ? getYouTubeVideoId(videoUrl) : null;
  const canTrackYouTube = movieId && onProgressUpdate && youTubeVideoId;

  // Clear interval on modal close or when dependencies change
  useEffect(() => {
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [progressInterval]);

  // Effect to handle progress tracking for DIRECT VIDEO
  useEffect(() => {
    if (!isOpen || !canTrackDirectVideo) {
      return;
    }
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handlePlay = () => {
      onProgressUpdate({ movieId, progress: videoElement.currentTime });
    };
    videoElement.addEventListener('play', handlePlay);

    const intervalId = setInterval(() => {
      if (!videoElement.paused) {
        onProgressUpdate({ movieId, progress: videoElement.currentTime });
      }
    }, 5000);
    setProgressInterval(intervalId);

    const handleEnded = () => {
      onProgressUpdate({ movieId, progress: videoElement.duration, isFinished: true });
    };
    videoElement.addEventListener('ended', handleEnded);

    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('ended', handleEnded);
      if (!videoElement.paused) {
         onProgressUpdate({ movieId, progress: videoElement.currentTime });
      }
    };
  }, [isOpen, canTrackDirectVideo, movieId, onProgressUpdate]);

  // Handlers for YouTube Player
  const handleYouTubePlay = (event: any) => {
    if (!canTrackYouTube) return;
    const player = event.target;
    // Clear previous interval if any
    if(progressInterval) clearInterval(progressInterval);
    const newInterval = setInterval(() => {
      onProgressUpdate({ movieId, progress: player.getCurrentTime() });
    }, 5000);
    setProgressInterval(newInterval);
  };

  const handleYouTubeStateChange = (event: any) => {
    if (!canTrackYouTube) return;
    // Clear interval when paused, buffered, etc.
    // 1 === playing
    if (event.data !== 1) { 
       if (progressInterval) clearInterval(progressInterval);
       setProgressInterval(null);
    }
  }

  const handleYouTubeEnd = (event: any) => {
    if (!canTrackYouTube) return;
    if (progressInterval) clearInterval(progressInterval);
    setProgressInterval(null);
    onProgressUpdate({ movieId, progress: event.target.getDuration(), isFinished: true });
  };
  
  if (!isOpen || !videoUrl) return null;

  const youtubePlayerOptions = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-none sm:max-w-none w-5/7 h-auto aspect-video p-0">
        <DialogHeader className="p-4 absolute top-0 left-0 bg-linear-to-b from-black/70 to-transparent w-full z-10">
          <DialogTitle className="text-white">{title || 'Video Player'}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video bg-black">
          {canTrackYouTube && youTubeVideoId ? (
            <YouTube
              videoId={youTubeVideoId}
              opts={youtubePlayerOptions}
              onPlay={handleYouTubePlay}
              onStateChange={handleYouTubeStateChange}
              onEnd={handleYouTubeEnd}
              className="w-full h-full"
            />
          ) : canTrackDirectVideo ? (
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="flex items-center justify-center h-full bg-black text-white">
              <p>Cannot track progress for this video or URL is invalid.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 