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

  const hasVideo = Boolean(
    adType === 'VIDEO' ||
    adData.cards?.[0]?.videoUrls?.hd ||
    adData.cards?.[0]?.videoUrls?.sd
  );

  const typeIcon = hasVideo ? <Play className="w-3 h-3" /> :
    (adType === 'CAROUSEL' || adType === 'MULTI_IMAGE' || adType === 'DCO')
      ? <Images className="w-3 h-3" />
      : null;
  
  const renderMedia = () => {
    if (adType === 'DCO' && adData.cards) {
      // Wersje i media obsłuży wewnątrz AdCardDCO (media -> wersje pod spodem)
      return <AdCardDCO cards={adData.cards} />;
    }
    
    if ((adType === 'CAROUSEL' || adType === 'MULTI_IMAGE') && adData.cards) {
      return <AdCardCarousel cards={adData.cards} typeIcon={typeIcon} />;
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
      return <AdCardMedia card={videoCard} typeIcon={typeIcon} />;
    }
    
    if (adType === 'IMAGE') {
      const imageCard = adData.cards?.[0] || {
        title: adData.title || '',
        body: adData.body,
        imageUrl: adData.image?.resized_url || adData.image?.original_url || '',
        linkUrl: adData.linkUrl || '',
        ctaText: adData.ctaText || ''
      };
      return <AdCardMedia card={imageCard} typeIcon={typeIcon} />;
    }
    
    return null;
  };
  
  return (
    <div className="fb-ad-card group">
      <AdCardHeader 
        pageName={adData.pageName}
        profilePicUrl={adData.profilePicUrl}
        platform={adData.publisherPlatform}
      />

      {/* Główny tekst reklamy (jeśli bez kart) */}
      {adData.body && !adData.cards && (
        <div className="px-3 sm:px-4 pb-3">
          <p className="text-sm whitespace-pre-wrap line-clamp-3">
            {adData.body}
          </p>
        </div>
      )}
      
      {/* Media */}
      {renderMedia()}
      
      {/* Footer / CTA */}
      <AdCardFooter 
        linkUrl={adData.linkUrl || adData.cards?.[0]?.linkUrl}
        ctaText={adData.ctaText || adData.cards?.[0]?.ctaText}
        title={adData.title || adData.cards?.[0]?.title}
      />
    </div>
  );
}