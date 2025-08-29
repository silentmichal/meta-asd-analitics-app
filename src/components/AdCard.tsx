import { AdData } from '@/types/ad.types';
import AdCardHeader from './ad/AdCardHeader';
import AdCardFooter from './ad/AdCardFooter';
import AdCardCarousel from './ad/AdCardCarousel';
import AdCardDCO from './ad/AdCardDCO';
import AdCardMedia from './ad/AdCardMedia';
import { Play, Images } from 'lucide-react';

interface AdCardProps {
  ad: AdData;
}

export default function AdCard({ ad }: AdCardProps) {
  const { adType, adData } = ad;
  
  // Render media based on ad type
  const renderMedia = () => {
    if (adType === 'DCO' && adData.cards) {
      return <AdCardDCO cards={adData.cards} />;
    }
    
    if ((adType === 'CAROUSEL' || adType === 'MULTI_IMAGE') && adData.cards) {
      return <AdCardCarousel cards={adData.cards} />;
    }
    
    if (adType === 'VIDEO') {
      const videoCard = adData.cards?.[0] || {
        title: adData.title || '',
        body: adData.body,
        imageUrl: adData.previewImageUrl || '',
        videoUrls: adData.videoUrls,
        previewImageUrl: adData.previewImageUrl,
        linkUrl: adData.linkUrl || '',
        ctaText: adData.ctaText || ''
      };
      return <AdCardMedia card={videoCard} />;
    }
    
    if (adType === 'IMAGE') {
      const imageCard = adData.cards?.[0] || {
        title: adData.title || '',
        body: adData.body,
        imageUrl: adData.image?.resized_url || adData.image?.original_url || '',
        linkUrl: adData.linkUrl || '',
        ctaText: adData.ctaText || ''
      };
      return <AdCardMedia card={imageCard} />;
    }
    
    // Fallback for unknown types
    return null;
  };
  
  // Get type indicator icon
  const getTypeIcon = () => {
    if (adType === 'VIDEO' || (adData.cards?.[0]?.videoUrls?.hd || adData.cards?.[0]?.videoUrls?.sd)) {
      return <Play className="w-3 h-3" />;
    }
    if (adType === 'CAROUSEL' || adType === 'MULTI_IMAGE' || adType === 'DCO') {
      return <Images className="w-3 h-3" />;
    }
    return null;
  };
  
  return (
    <div className="fb-ad-card group">
      {/* Header */}
      <AdCardHeader 
        pageName={adData.pageName}
        profilePicUrl={adData.profilePicUrl}
        platform={adData.publisherPlatform}
      />
      
      {/* Main Ad Text (if exists and not in cards) */}
      {adData.body && !adData.cards && (
        <div className="px-3 sm:px-4 pb-3">
          <p className="text-sm whitespace-pre-wrap line-clamp-3">
            {adData.body}
          </p>
        </div>
      )}
      
      {/* Media Content */}
      {renderMedia()}
      
      {/* Footer with CTA */}
      <AdCardFooter 
        linkUrl={adData.linkUrl || adData.cards?.[0]?.linkUrl}
        ctaText={adData.ctaText || adData.cards?.[0]?.ctaText}
        title={adData.title || adData.cards?.[0]?.title}
      />
      
      {/* Type Badge */}
      {getTypeIcon() && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-background/80 rounded-full flex items-center justify-center">
          {getTypeIcon()}
        </div>
      )}
    </div>
  );
}