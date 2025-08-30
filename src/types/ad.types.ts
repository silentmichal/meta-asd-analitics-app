export type AdType = 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'DCO' | 'MULTI_IMAGE' | 'DPA';
export type AdStatus = 'ALL' | 'ACTIVE' | 'INACTIVE';

export interface AdFilters {
  pageId: string;
  status?: AdStatus;
  dateFrom?: string; // format YYYY-MM-DD
  dateTo?: string;   // format YYYY-MM-DD
}

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
  linkDescription?: string; // NEW
  caption?: string; // NEW - for DPA
}

export interface AdBasicInfo {
  json: {
    id: string;
    ad_snapshot_url: string;
    ad_creation_time: string;
    page_id: string;
    page_name: string;
    ad_creative_bodies?: string[];
    ad_creative_link_titles?: string[];
    ad_creative_link_descriptions?: string[];
    ad_creative_link_captions?: string[];
    publisher_platforms: string[];
    ad_delivery_start_time: string;
    ad_delivery_stop_time?: string;
  };
  pairedItem?: {
    item: number;
    sourceOverwrite?: {
      previousNode: string;
    };
  };
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
    linkDescription?: string; // NEW
    caption?: string; // NEW - for DPA
    publisherPlatform: string;
    profilePicUrl?: string;
    image?: AdImage;
    images?: AdImage[]; // NEW - for MULTI_IMAGE type
    video?: { // NEW - raw video data from API
      hd_url: string | null;
      sd_url: string | null;
      preview_image_url: string | null;
    };
    previewImageUrl?: string;
    videoUrls?: VideoUrls;
    cards?: AdCard[];
  };
  basic?: AdBasicInfo; // NEW - contains platform and date information
}

export interface StoredAnalysis {
  timestamp: string;
  pageName: string;
  pageId: string;
  totalAds: number;
  ads: AdData[];
}

export type CardDisplayType = 'IMAGE' | 'VIDEO' | 'CAROUSEL';