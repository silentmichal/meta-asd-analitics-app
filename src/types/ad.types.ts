export type AdType = 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'DCO' | 'MULTI_IMAGE';

export interface AdImage {
  original_url: string;
  resized_url: string;
}

export interface VideoUrls {
  hd: string | null;
  sd: string | null;
}

export interface AdCard {
  title: string;
  body: string | null;
  imageUrl: string;
  videoUrls?: VideoUrls;
  previewImageUrl?: string | null;
  linkUrl: string;
  ctaText: string;
}

export interface AdData {
  success: boolean;
  adType: AdType;
  adData: {
    pageName: string;
    adArchiveID: string | number;
    body: string;
    title?: string;
    ctaText?: string;
    linkUrl?: string;
    publisherPlatform: string;
    profilePicUrl?: string;
    // For IMAGE type
    image?: AdImage;
    // For VIDEO type
    previewImageUrl?: string;
    videoUrls?: VideoUrls;
    // For CAROUSEL and DCO types
    cards?: AdCard[];
  };
}

export interface StoredAnalysis {
  timestamp: string;
  pageName: string;
  pageId: string;
  totalAds: number;
  ads: AdData[];
}

export type CardDisplayType = 'IMAGE' | 'VIDEO' | 'CAROUSEL';