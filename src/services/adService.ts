import { AdData } from '@/types/ad.types';

const WEBHOOK_URL = 'https://n8n.akademia.click/webhook/f319c524-6a23-4f7d-b4e4-25741eb39063';

interface WebhookResponse {
  details: AdData[];
}

export async function fetchAdsFromWebhook(pageId: string): Promise<{
  ads: AdData[];
  pageName: string;
}> {
  try {
    // Build URL with query parameter
    const url = new URL(WEBHOOK_URL);
    url.searchParams.append('id', pageId);
    
    console.log('Fetching ads from webhook:', url.toString());
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Webhook response:', data);
    
    // Extract ads from the response structure
    if (Array.isArray(data) && data[0]?.details) {
      const ads = data[0].details.filter((item: any) => item.success === true);
      
      // Get page name from first ad
      const pageName = ads.length > 0 && ads[0].adData?.pageName 
        ? ads[0].adData.pageName 
        : 'Unknown Page';
      
      return {
        ads,
        pageName
      };
    }
    
    // Fallback if structure is different
    return {
      ads: [],
      pageName: 'Unknown Page'
    };
    
  } catch (error) {
    console.error('Error fetching ads from webhook:', error);
    throw error;
  }
}