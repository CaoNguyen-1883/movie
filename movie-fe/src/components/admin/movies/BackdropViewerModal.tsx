import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface BackdropViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  urls: string[];
  title: string;
}

export function BackdropViewerModal({ isOpen, onClose, urls, title }: BackdropViewerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Backdrops for: {title}</DialogTitle>
          <DialogDescription>
            {urls.length} image(s) found.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {urls.map((url, index) => (
            <div key={index} className="rounded-md overflow-hidden border">
              <img 
                src={url} 
                alt={`Backdrop ${index + 1} for ${title}`} 
                className="w-full h-full object-cover aspect-video"
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 