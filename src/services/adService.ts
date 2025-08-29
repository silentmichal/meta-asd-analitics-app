import { AdData } from '@/types/ad.types';

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
    const adInfo = item.details || item;
    if (!adInfo.success) return null;
    
    const adData = { ...adInfo.adData };
    
    if (adData.body) {
      adData.body = decodeHtmlEntities(adData.body);
    }
    
    if (adData.title) {
      adData.title = decodeHtmlEntities(adData.title);
    }
    
    if (adData.cards && Array.isArray(adData.cards)) {
      adData.cards = adData.cards.map((card: any) => ({
        ...card,
        title: decodeHtmlEntities(card.title),
        body: decodeHtmlEntities(card.body)
      }));
    }
    
    return {
      success: adInfo.success,
      adType: adInfo.adType,
      adData
    };
  } catch (error) {
    console.error('Error parsing ad data:', error);
    return null;
  }
}

// Fetch ads from API
export async function fetchAds(pageId: string): Promise<AdData[]> {
  try {
    const response = await fetch(
      `https://n8n.akademia.click/webhook/f319c524-6a23-4f7d-b4e4-25741eb39063?id=${pageId}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ads: ${response.status}`);
    }
    
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