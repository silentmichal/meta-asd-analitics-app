import { Play, MoreHorizontal } from 'lucide-react';
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
    <div className="ad-card">
      {/* Header with Brand Info */}
      <div className="ad-card-header">
        <div className="brand-info">
          {ad.adData.profilePicUrl ? (
            <img 
              src={ad.adData.profilePicUrl} 
              alt={ad.adData.pageName}
              className="brand-logo"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="brand-logo bg-muted flex items-center justify-center">
              <span className="text-xs font-bold text-muted-foreground">
                {ad.adData.pageName?.charAt(0) || 'A'}
              </span>
            </div>
          )}
          <div>
            <h4 className="brand-name">{ad.adData.pageName}</h4>
            <span className="sponsored-label">Sponsorowane</span>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Ad Text Content */}
      {ad.adData.body && (
        <div className="ad-content">
          <p className="ad-text">{ad.adData.body}</p>
        </div>
      )}

      {/* Main Image/Video */}
      <div className="ad-image-container">
        {!imageError ? (
          <img
            src={imageUrl}
            alt={`${ad.adData.pageName} - ${ad.adType} Ad`}
            className="ad-main-image"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="ad-main-image bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Obraz niedostępny</span>
          </div>
        )}
        
        {/* Video Overlay */}
        {cardType === 'VIDEO' && (
          <div className="video-overlay">
            <Play size={20} fill="currentColor" className="ml-0.5" />
          </div>
        )}
        
        {/* Carousel Indicators */}
        {cardType === 'CAROUSEL' && ad.adData.cards && ad.adData.cards.length > 1 && (
          <div className="carousel-indicators">
            {ad.adData.cards.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === 0 ? 'active' : ''}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Link Preview Footer */}
      {ad.adData.linkUrl && (
        <div className="ad-link-preview">
          <span className="link-text">
            {ad.adData.linkUrl.replace(/^https?:\/\//, '').split('/')[0]}
          </span>
        </div>
      )}
    </div>
  );
}