import { useState } from 'react';
import { AdData } from '@/types/ad.types';
import AdCardHeader from './ad/AdCardHeader';
import AdCardFooter from './ad/AdCardFooter';
import AdCardCarousel from './ad/AdCardCarousel';
import DcoVersionBar from './ad/AdCardDCO';
import AdCardMedia from './ad/AdCardMedia';
import { Play, Images } from 'lucide-react';

interface AdCardProps {
  ad: AdData;
}

export default function AdCard({ ad }: AdCardProps) {
  const { adType, adData } = ad;

  const [selectedVersion, setSelectedVersion] = useState(0);

  const hasVideo = Boolean(
    adType === 'VIDEO' ||
    adData.cards?.[0]?.videoUrls?.hd ||
    adData.cards?.[0]?.videoUrls?.sd
  );

  const typeIcon = hasVideo ? <Play className="w-3 h-3" /> :
    (adType === 'CAROUSEL' || adType === 'MULTI_IMAGE' || adType === 'DCO')
      ? <Images className="w-3 h-3" />
      : null;

  // Tekst nad mediami: zgodnie z wcześniejszą logiką
  let bodyText: string | null | undefined = null;
  if (adType === 'DCO') {
    const cards = adData.cards || [];
    const current = cards[Math.min(selectedVersion, Math.max(cards.length - 1, 0))];
    bodyText = (current && current.body) || adData.body || null;
  } else {
    bodyText = adData.body || adData.cards?.[0]?.body || null;
  }

  const renderMedia = () => {
    if (adType === 'DCO' && adData.cards && adData.cards.length > 0) {
      const current = adData.cards[Math.min(selectedVersion, adData.cards.length - 1)];
      return <AdCardMedia card={current} typeIcon={typeIcon} />;
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
        ctaText: adData.ctaText || '',
        linkDescription: adData.linkDescription || '' // NEW safety
      };
      return <AdCardMedia card={videoCard} typeIcon={typeIcon} />;
    }
    if (adType === 'IMAGE') {
      const imageCard = adData.cards?.[0] || {
        title: adData.title || '',
        body: adData.body,
        imageUrl: adData.image?.resized_url || adData.image?.original_url || '',
        linkUrl: adData.linkUrl || '',
        ctaText: adData.ctaText || '',
        linkDescription: adData.linkDescription || '' // NEW safety
      };
      return <AdCardMedia card={imageCard} typeIcon={typeIcon} />;
    }
    return null;
  };

  return (
    <div>
      <div className="fb-ad-card group">
        <AdCardHeader 
          pageName={adData.pageName}
          profilePicUrl={adData.profilePicUrl}
          platform={adData.publisherPlatform}
          platforms={ad.basic?.json.publisher_platforms}
          startDate={ad.basic?.json.ad_delivery_start_time}
          endDate={ad.basic?.json.ad_delivery_stop_time}
        />

        {bodyText && (
          <div className="px-3 sm:px-4 pb-3">
            <p className="text-sm whitespace-pre-wrap line-clamp-3">
              {bodyText}
            </p>
          </div>
        )}

        {renderMedia()}

        {/* Przekazujemy linkDescription do CTA */}
        <AdCardFooter 
          linkUrl={
            adType === 'DCO' && adData.cards 
              ? adData.cards[Math.min(selectedVersion, adData.cards.length - 1)]?.linkUrl
              : (adData.linkUrl || adData.cards?.[0]?.linkUrl)
          }
          ctaText={
            adType === 'DCO' && adData.cards
              ? adData.cards[Math.min(selectedVersion, adData.cards.length - 1)]?.ctaText
              : (adData.ctaText || adData.cards?.[0]?.ctaText)
          }
          title={
            adType === 'DCO' && adData.cards
              ? adData.cards[Math.min(selectedVersion, adData.cards.length - 1)]?.title
              : (adData.title || adData.cards?.[0]?.title)
          }
          linkDescription={
            adType === 'DCO' && adData.cards
              ? adData.cards[Math.min(selectedVersion, adData.cards.length - 1)]?.linkDescription
              : (adData.linkDescription || adData.cards?.[0]?.linkDescription || undefined)
          }
          platforms={ad.basic?.json.publisher_platforms}
        />
      </div>

      {adType === 'DCO' && adData.cards && adData.cards.length > 1 && (
        <DcoVersionBar
          count={adData.cards.length}
          selectedIndex={selectedVersion}
          onSelect={setSelectedVersion}
        />
      )}
    </div>
  );
}