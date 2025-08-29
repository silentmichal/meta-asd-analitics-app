import { Play } from 'lucide-react';
import { AdData } from '@/types/ad.types';
import { determineCardType, getImageUrl } from '@/utils/adUtils';
import { useState } from 'react';

interface AdCardProps {
  ad: AdData;
}

export default function AdCard({ ad }: AdCardProps) {
  const [imageError, setImageError] = useState(false);
  const cardType = determineCardType(ad);
  const imageUrl = getImageUrl(ad);
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="ad-card group relative aspect-square overflow-hidden rounded-2xl bg-card shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      {/* Image Container */}
      <div className="relative w-full h-full">
        {!imageError ? (
          <img
            src={imageUrl}
            alt={`${ad.adData.pageName} - ${ad.adType} Ad`}
            className="w-full h-full object-cover"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Image unavailable</span>
          </div>
        )}
        
        {/* Video Overlay */}
        {cardType === 'VIDEO' && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity group-hover:bg-black/40">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110">
              <Play className="w-8 h-8 text-foreground ml-1" fill="currentColor" />
            </div>
          </div>
        )}
        
        {/* Carousel Indicators */}
        {cardType === 'CAROUSEL' && ad.adData.cards && ad.adData.cards.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5">
            {ad.adData.cards.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === 0
                    ? 'bg-white w-6'
                    : 'bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Ad Type Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full">
          <span className="text-xs font-medium text-foreground">
            {cardType}
          </span>
        </div>
        
        {/* Platform Badge */}
        {ad.adData.publisherPlatform && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full">
            <span className="text-xs font-medium text-foreground">
              {ad.adData.publisherPlatform}
            </span>
          </div>
        )}
      </div>
      
      {/* Hover Overlay with Ad Details */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
        {ad.adData.title && (
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
            {ad.adData.title}
          </h3>
        )}
        {ad.adData.body && (
          <p className="text-white/90 text-xs line-clamp-2">
            {ad.adData.body}
          </p>
        )}
        {ad.adData.ctaText && (
          <span className="mt-2 inline-block text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full w-fit">
            {ad.adData.ctaText}
          </span>
        )}
      </div>
    </div>
  );
}