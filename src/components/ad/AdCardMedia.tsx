import { useState, ReactNode } from 'react';
import { Play } from 'lucide-react';
import { AdCard } from '@/types/ad.types';

interface AdCardMediaProps {
  card: AdCard;
  typeIcon?: ReactNode;
}

export default function AdCardMedia({ card, typeIcon }: AdCardMediaProps) {
  const videoSrc = card.videoUrls?.hd || card.videoUrls?.sd || '';
  const isVideo = Boolean(videoSrc);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="relative bg-muted overflow-hidden">
      {/* MEDIA */}
      {isVideo && showVideo ? (
        <video
          key={videoSrc}                 // resetuje odtwarzacz przy zmianie karty
          src={videoSrc}
          poster={card.previewImageUrl || card.imageUrl}
          controls
          autoPlay
          playsInline
          className="w-full h-auto object-contain"
        />
      ) : (
        <div className="relative">
          <img
            src={card.previewImageUrl || card.imageUrl}
            alt={card.title || 'Ad media'}
            className="w-full h-auto object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />

          {/* Przyciski/overlays */}
          {isVideo && (
            <button
              type="button"
              onClick={() => setShowVideo(true)}
              aria-label="Odtwórz wideo"
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="w-16 h-16 bg-background/80 rounded-full flex items-center justify-center shadow">
                <Play className="w-8 h-8 ml-1" />
              </span>
            </button>
          )}
        </div>
      )}

      {/* Badge typu (jeśli chcesz, możesz wyłączyć) */}
      {typeIcon && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-background/80 rounded-full flex items-center justify-center">
          {typeIcon}
        </div>
      )}
    </div>
  );
}