import { AdData, AdFilters } from '@/types/ad.types';

// Decode HTML entities
function decodeHtmlEntities(text: string | null | undefined): string {
  if (!text) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

// Parse single ad data
function parseAdData(item: any): AdData | null {
  try {
    // Debug logging for raw API data
    console.log('Raw item from API:', item);
    console.log('Has basic field:', !!item.basic);
    if (item.basic) {
      console.log('Basic field structure:', item.basic);
    }
    
    const adInfo = item.details || item;
    if (!adInfo.success) return null;

    const adData = { ...adInfo.adData };

    // Decode main text fields
    if (adData.body) adData.body = decodeHtmlEntities(adData.body);
    if (adData.title) adData.title = decodeHtmlEntities(adData.title);
    if (adData.linkDescription) adData.linkDescription = decodeHtmlEntities(adData.linkDescription); // NEW
    if (adData.caption) adData.caption = decodeHtmlEntities(adData.caption); // NEW - for DPA

  // Decode cards
  if (adData.cards && Array.isArray(adData.cards)) {
    adData.cards = adData.cards.map((card: any) => ({
      ...card,
      title: decodeHtmlEntities(card.title),
      body: decodeHtmlEntities(card.body),
      linkDescription: card.linkDescription ? decodeHtmlEntities(card.linkDescription) : card.linkDescription, // NEW
      caption: card.caption ? decodeHtmlEntities(card.caption) : card.caption // NEW - for DPA
    }));
  }

  // Convert MULTI_IMAGE images to cards format
  if (adInfo.adType === 'MULTI_IMAGE' && adData.images && Array.isArray(adData.images)) {
    adData.cards = adData.images.map((image: any) => ({
      title: adData.title || '',
      body: null,
      imageUrl: image.resized_url || image.original_url,
      linkUrl: adData.linkUrl || '',
      ctaText: adData.ctaText || '',
      linkDescription: adData.linkDescription || null
    }));
  }

  // Convert VIDEO format from API to expected format
  if (adInfo.adType === 'VIDEO' && adData.video) {
    adData.videoUrls = {
      hd: adData.video.hd_url,
      sd: adData.video.sd_url
    };
    adData.previewImageUrl = adData.video.preview_image_url || null;
  }

  return {
    success: adInfo.success,
    adType: adInfo.adType,
    adData,
    basic: item.basic // NEW - pass through basic field with platform and date info
  };
  } catch (error) {
    console.error('Error parsing ad data:', error);
    return null;
  }
}

// Fetch ads from API
export async function fetchAds(filters: AdFilters): Promise<AdData[]> {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('id', filters.pageId);
    
    if (filters.status && filters.status !== 'ALL') {
      params.append('status', filters.status);
    }
    
    if (filters.dateFrom) {
      params.append('dateFrom', filters.dateFrom);
    }
    
    if (filters.dateTo) {
      params.append('dateTo', filters.dateTo);
    }
    
    const response = await fetch(
      `https://n8n.akademia.click/webhook/f319c524-6a23-4f7d-b4e4-25741eb39063?${params.toString()}`
    );
    if (!response.ok) throw new Error(`Failed to fetch ads: ${response.status}`);

    const data = await response.json();
    let rawAds: any[] = [];

    if (data.details && Array.isArray(data.details)) {
      rawAds = data.details;
    } else if (Array.isArray(data)) {
      rawAds = data;
    } else {
      console.error('Unexpected API response format:', data);
      return [];
    }

    const parsedAds = rawAds
      .map(item => parseAdData(item))
      .filter((ad): ad is AdData => ad !== null);

    return parsedAds;
  } catch (error) {
    console.error('Error fetching ads:', error);
    throw error;
  }
}

// Extract page name from ads
export function extractPageName(ads: AdData[]): string {
  if (ads.length > 0 && ads[0].adData.pageName) {
    return ads[0].adData.pageName;
  }
  return 'Unknown Page';
}

// Extract domain from URL
export function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return url;
  }
}