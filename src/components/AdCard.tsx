import { useState, useRef, useEffect } from 'react';
import { AdData } from '@/types/ad.types';
import AdCardHeader from './ad/AdCardHeader';
import AdCardFooter from './ad/AdCardFooter';
import AdCardCarousel from './ad/AdCardCarousel';
import DcoVersionBar from './ad/AdCardDCO';
import AdCardMedia from './ad/AdCardMedia';
import AdStatisticsDialog from './AdStatisticsDialog';
import { Play, Images, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AdCardProps {
  ad: AdData;
}

export default function AdCard({ ad }: AdCardProps) {
  const { adType, adData } = ad;

  const [selectedVersion, setSelectedVersion] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const hasVideo = Boolean(
    adType === 'VIDEO' ||
    adData.cards?.[0]?.videoUrls?.hd ||
    adData.cards?.[0]?.videoUrls?.sd
  );

  const typeIcon = hasVideo ? <Play className="w-3 h-3" /> :
    (adType === 'CAROUSEL' || adType === 'MULTI_IMAGE' || adType === 'DCO' || adType === 'DPA')
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

  // Check if text is truncated when component mounts or bodyText changes
  useEffect(() => {
    if (textRef.current && bodyText) {
      const element = textRef.current;
      // Check if text overflows (is truncated)
      const isTruncated = element.scrollHeight > element.clientHeight;
      setShowExpandButton(isTruncated);
    }
  }, [bodyText, selectedVersion]);

  const renderMedia = () => {
    if (adType === 'DCO' && adData.cards && adData.cards.length > 0) {
      const current = adData.cards[Math.min(selectedVersion, adData.cards.length - 1)];
      return <AdCardMedia card={current} typeIcon={typeIcon} />;
    }
    if ((adType === 'CAROUSEL' || adType === 'MULTI_IMAGE' || adType === 'DPA') && adData.cards) {
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

  // Check if we have any statistical data
  const hasStatistics = ad.basic && (
    ad.basic.target_gender || 
    ad.basic.target_locations || 
    ad.basic.eu_total_reach || 
    ad.basic.beneficiary_payers ||
    ad.basic.age_country_gender_reach_breakdown
  );

  return (
    <div>
      <div className="fb-ad-card group relative">
        {/* Statistics button */}
        {hasStatistics && (
          <div className="absolute top-3 right-3 z-10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => setShowStatistics(true)}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zobacz statystyki</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        <AdCardHeader 
          pageName={adData.pageName}
          profilePicUrl={adData.profilePicUrl}
          platform={adData.publisherPlatform}
          platforms={ad.basic?.publisher_platforms}
          startDate={ad.basic?.ad_delivery_start_time}
          endDate={ad.basic?.ad_delivery_stop_time}
        />

        {bodyText && (
          <div className="px-3 sm:px-4 pb-3">
            <p 
              ref={textRef}
              className={`text-sm whitespace-pre-wrap transition-all duration-300 ${
                !isExpanded ? 'line-clamp-3' : ''
              }`}
            >
              {bodyText}
            </p>
            {(showExpandButton || isExpanded) && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 flex items-center gap-0.5"
              >
                {isExpanded ? (
                  <>
                    Pokaż mniej
                    <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    Pokaż więcej
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {renderMedia()}

        {/* Przekazujemy linkDescription i caption do CTA */}
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
          caption={
            adType === 'DPA' && adData.cards
              ? adData.cards[0]?.caption
              : adData.caption
          }
        />
      </div>

      {adType === 'DCO' && adData.cards && adData.cards.length > 1 && (
        <DcoVersionBar
          count={adData.cards.length}
          selectedIndex={selectedVersion}
          onSelect={setSelectedVersion}
        />
      )}

      {/* Statistics Dialog */}
      <AdStatisticsDialog
        isOpen={showStatistics}
        onClose={() => setShowStatistics(false)}
        data={ad.basic}
        pageName={adData.pageName}
      />
    </div>
  );
}