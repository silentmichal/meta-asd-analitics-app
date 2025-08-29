import { AdData, CardDisplayType } from '@/types/ad.types';

export function determineCardType(ad: AdData): CardDisplayType {
  const adType = ad.adType;
  
  if (adType === 'IMAGE') {
    return 'IMAGE';
  } else if (adType === 'VIDEO') {
    return 'VIDEO';
  } else if (adType === 'CAROUSEL') {
    return 'CAROUSEL';
  } else if (adType === 'DCO') {
    // DCO can contain different types
    if (ad.adData.cards && ad.adData.cards.length > 1) {
      return 'CAROUSEL';
    } else if (ad.adData.cards && ad.adData.cards[0].videoUrls && 
               (ad.adData.cards[0].videoUrls.hd || ad.adData.cards[0].videoUrls.sd)) {
      return 'VIDEO';
    } else {
      return 'IMAGE';
    }
  }
  
  return 'IMAGE'; // fallback
}

export function getImageUrl(ad: AdData): string {
  const cardType = determineCardType(ad);
  
  if (cardType === 'IMAGE') {
    if (ad.adData.image?.resized_url) {
      return ad.adData.image.resized_url;
    } else if (ad.adData.cards?.[0]?.imageUrl) {
      return ad.adData.cards[0].imageUrl;
    }
  } else if (cardType === 'VIDEO') {
    if (ad.adData.previewImageUrl) {
      return ad.adData.previewImageUrl;
    } else if (ad.adData.cards?.[0]?.previewImageUrl) {
      return ad.adData.cards[0].previewImageUrl || ad.adData.cards[0].imageUrl;
    }
  } else if (cardType === 'CAROUSEL') {
    if (ad.adData.cards?.[0]?.imageUrl) {
      return ad.adData.cards[0].imageUrl;
    }
  }
  
  return '/placeholder.svg'; // Fallback image
}

export function validateFacebookPageId(pageId: string): boolean {
  // Facebook Page ID can be numeric or alphanumeric (custom username)
  const numericPattern = /^\d{10,20}$/;
  const usernamePattern = /^[a-zA-Z0-9.]{1,50}$/;
  
  return numericPattern.test(pageId) || usernamePattern.test(pageId);
}

// Decode HTML entities
export function decodeHtmlEntities(text: string | null | undefined): string {
  if (!text) return '';
  
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

// Extract domain from URL
export function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return '';
  }
}

// Format platform name
export function formatPlatform(platform: string): string {
  const platformMap: { [key: string]: string } = {
    'facebook': 'Facebook',
    'instagram': 'Instagram',
    'messenger': 'Messenger',
    'audience_network': 'Audience Network'
  };
  
  return platformMap[platform.toLowerCase()] || platform;
}