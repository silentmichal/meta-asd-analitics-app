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

  // meta do headera – defensywnie z ad.basic?.json (bez zmian typów)
  const startDate = (ad as any)?.basic?.json?.ad_delivery_start_time as string | undefined;
  const stopDate  = (ad as any)?.basic?.json?.ad_delivery_stop_time as string | undefined | null;
  const platforms = (ad as any)?.basic?.json?.publisher_platforms as string[] | undefined;

  const hasVideo = Boolean(
    adType === 'VIDEO' ||
    adData.cards?.[0]?.videoUrls?.hd ||
    adData.cards?.[0]?.videoUrls?.sd
  );

  const typeIcon = hasVideo
    ? <Play className="w-3 h-3" />
    : (adType === 'CAROUSEL' || adType === 'MULTI_IMAGE' || adType === 'DCO')
      ? <Images className="w-3 h-3" />
      : null;

  // BODY (nad mediami): DCO -> body z wybranej karty, inaczej adData/body -> cards[0]/body
  let bodyText: string | null | undefined = null;
  if (adType === 'DCO') {
    const cards = adData.cards || [];
    const safeIndex = Math.min(selectedVersion, Math.max(cards.length - 1, 0));
    const current = cards[safeIndex];
    bodyText = (current && current.body) || adData.body || null;
  } else {
    bodyText = adData.body || adData.cards?.[0]?.body || null;
  }

  const renderMedia = () => {
    if (adType === 'DCO' && adData.cards && adData.cards.length > 0) {
      const safeIndex = Math.min(selectedVersion, adData.cards.length - 1);
      const current = adData.cards[safeIndex];
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
        linkDescription: adData.linkDescription || ''
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
        linkDescription: adData.linkDescription || ''
      };
      return <AdCardMedia card={imageCard} typeIcon={typeIcon} />;
    }
    return null;
  };

  // wartości do CTA (DCO z aktualnej karty)
  const cards = adData.cards || [];
  const safeIndex = Math.min(selectedVersion, Math.max(cards.length - 1, 0));
  const currentCard = cards[safeIndex];

  const linkUrl = adType === 'DCO' && cards.length ? currentCard?.linkUrl : (adData.linkUrl || adData.cards?.[0]?.linkUrl);
  const ctaText = adType === 'DCO' && cards.length ? currentCard?.ctaText : (adData.ctaText || adData.cards?.[0]?.ctaText);
  const title   = adType === 'DCO' && cards.length ? currentCard?.title   : (adData.title   || adData.cards?.[0]?.title);
  const linkDescription =
    adType === 'DCO' && cards.length
      ? currentCard?.linkDescription
      : (adData.linkDescription || adData.cards?.[0]?.linkDescription || undefined);

  return (
    <div>
      <div className="fb-ad-card group">
        <AdCardHeader
          pageName={adData.pageName}
          profilePicUrl={adData.profilePicUrl}
          platform={adData.publisherPlatform}
          startDate={startDate}
          stopDate={stopDate ?? undefined}
          platforms={platforms}
        />

        {bodyText && (
          <div className="px-3 sm:px-4 pb-3">
            <p className="text-sm whitespace-pre-wrap line-clamp-3">{bodyText}</p>
          </div>
        )}

        {renderMedia()}

        <AdCardFooter
          linkUrl={linkUrl}
          ctaText={ctaText}
          title={title}
          linkDescription={linkDescription}
        />
      </div>

      {adType === 'DCO' && cards.length > 1 && (
        <DcoVersionBar
          count={cards.length}
          selectedIndex={selectedVersion}
          onSelect={setSelectedVersion}
        />
      )}
    </div>
  );
}