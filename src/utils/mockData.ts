import { AdData } from '@/types/ad.types';

export const mockAds: AdData[] = [
  // IMAGE type ads
  {
    success: true,
    adType: 'IMAGE',
    adData: {
      pageName: 'Nike Poland',
      adArchiveID: '1234567890',
      body: 'Odkryj nową kolekcję butów Nike Air Max. Wygoda i styl w jednym. Kup teraz i poczuj różnicę!',
      title: 'Nike Air Max 2025',
      ctaText: 'Kup teraz',
      linkUrl: 'https://nike.com/air-max',
      publisherPlatform: 'Facebook',
      profilePicUrl: 'https://picsum.photos/100/100?random=1',
      image: {
        original_url: 'https://picsum.photos/800/800?random=2',
        resized_url: 'https://picsum.photos/400/400?random=2'
      }
    }
  },
  {
    success: true,
    adType: 'IMAGE',
    adData: {
      pageName: 'Nike Poland',
      adArchiveID: '1234567891',
      body: 'Limitowana edycja Nike Dunk Low. Tylko 1000 par dostępnych w Polsce!',
      title: 'Nike Dunk Low - Edycja Limitowana',
      ctaText: 'Zobacz więcej',
      linkUrl: 'https://nike.com/dunk-low',
      publisherPlatform: 'Instagram',
      image: {
        original_url: 'https://picsum.photos/800/800?random=3',
        resized_url: 'https://picsum.photos/400/400?random=3'
      }
    }
  },
  // VIDEO type ads
  {
    success: true,
    adType: 'VIDEO',
    adData: {
      pageName: 'Nike Poland',
      adArchiveID: '1234567892',
      body: 'Zobacz, jak profesjonalni sportowcy trenują w nowych Nike React. Film dokumentalny.',
      title: 'Nike React - Behind the Scenes',
      ctaText: 'Oglądaj',
      linkUrl: 'https://nike.com/react',
      publisherPlatform: 'Facebook',
      previewImageUrl: 'https://picsum.photos/400/400?random=4',
      videoUrls: {
        hd: 'https://example.com/video-hd.mp4',
        sd: 'https://example.com/video-sd.mp4'
      }
    }
  },
  {
    success: true,
    adType: 'VIDEO',
    adData: {
      pageName: 'Nike Poland',
      adArchiveID: '1234567893',
      body: 'Trening z mistrzem. Zobacz jak Robert Lewandowski przygotowuje się do sezonu.',
      title: 'Train Like a Pro',
      ctaText: 'Zobacz więcej',
      linkUrl: 'https://nike.com/training',
      publisherPlatform: 'Instagram',
      previewImageUrl: 'https://picsum.photos/400/400?random=5',
      videoUrls: {
        hd: 'https://example.com/training-hd.mp4',
        sd: 'https://example.com/training-sd.mp4'
      }
    }
  },
  // CAROUSEL type ads
  {
    success: true,
    adType: 'CAROUSEL',
    adData: {
      pageName: 'Nike Poland',
      adArchiveID: '1234567894',
      body: 'Kolekcja wiosenna 2025. Wybierz swój ulubiony model.',
      title: 'Wiosenna Kolekcja Nike',
      publisherPlatform: 'Facebook',
      cards: [
        {
          title: 'Nike Air Force 1',
          body: 'Klasyk w nowej odsłonie',
          imageUrl: 'https://picsum.photos/400/400?random=6',
          linkUrl: 'https://nike.com/air-force-1',
          ctaText: 'Kup teraz'
        },
        {
          title: 'Nike Blazer Mid',
          body: 'Retro styl na co dzień',
          imageUrl: 'https://picsum.photos/400/400?random=7',
          linkUrl: 'https://nike.com/blazer',
          ctaText: 'Zobacz więcej'
        },
        {
          title: 'Nike Cortez',
          body: 'Legenda powraca',
          imageUrl: 'https://picsum.photos/400/400?random=8',
          linkUrl: 'https://nike.com/cortez',
          ctaText: 'Odkryj'
        }
      ]
    }
  },
  {
    success: true,
    adType: 'CAROUSEL',
    adData: {
      pageName: 'Nike Poland',
      adArchiveID: '1234567895',
      body: 'Akcesoria sportowe Nike. Wszystko czego potrzebujesz do treningu.',
      publisherPlatform: 'Instagram',
      cards: [
        {
          title: 'Plecak Nike',
          body: null,
          imageUrl: 'https://picsum.photos/400/400?random=9',
          linkUrl: 'https://nike.com/backpack',
          ctaText: 'Kup'
        },
        {
          title: 'Bidon Nike',
          body: null,
          imageUrl: 'https://picsum.photos/400/400?random=10',
          linkUrl: 'https://nike.com/bottle',
          ctaText: 'Zobacz'
        }
      ]
    }
  },
  // DCO type ads (dynamic creative optimization)
  {
    success: true,
    adType: 'DCO',
    adData: {
      pageName: 'Nike Poland',
      adArchiveID: '1234567896',
      body: 'Spersonalizowana oferta Nike tylko dla Ciebie. -20% na wybrane produkty.',
      title: 'Oferta Specjalna',
      publisherPlatform: 'Facebook',
      cards: [
        {
          title: 'Nike Pegasus 40',
          body: 'Buty do biegania',
          imageUrl: 'https://picsum.photos/400/400?random=11',
          linkUrl: 'https://nike.com/pegasus',
          ctaText: 'Kup ze zniżką'
        }
      ]
    }
  },
  // More IMAGE ads for pagination testing
  {
    success: true,
    adType: 'IMAGE',
    adData: {
      pageName: 'Nike Poland',
      adArchiveID: '1234567897',
      body: 'Nike Pro - odzież kompresyjna dla profesjonalistów.',
      title: 'Nike Pro Collection',
      ctaText: 'Sprawdź',
      linkUrl: 'https://nike.com/pro',
      publisherPlatform: 'Facebook',
      image: {
        original_url: 'https://picsum.photos/800/800?random=12',
        resized_url: 'https://picsum.photos/400/400?random=12'
      }
    }
  },
  {
    success: true,
    adType: 'IMAGE',
    adData: {
      pageName: 'Nike Poland',
      adArchiveID: '1234567898',
      body: 'Buty dla dzieci Nike. Wygoda i bezpieczeństwo podczas zabawy.',
      ctaText: 'Zobacz kolekcję',
      linkUrl: 'https://nike.com/kids',
      publisherPlatform: 'Instagram',
      image: {
        original_url: 'https://picsum.photos/800/800?random=13',
        resized_url: 'https://picsum.photos/400/400?random=13'
      }
    }
  },
  {
    success: true,
    adType: 'VIDEO',
    adData: {
      pageName: 'Nike Poland',
      adArchiveID: '1234567899',
      body: 'Nike Yoga Collection. Znajdź swój wewnętrzny spokój.',
      ctaText: 'Odkryj',
      linkUrl: 'https://nike.com/yoga',
      publisherPlatform: 'Facebook',
      previewImageUrl: 'https://picsum.photos/400/400?random=14',
      videoUrls: {
        hd: null,
        sd: 'https://example.com/yoga.mp4'
      }
    }
  },
  {
    success: true,
    adType: 'IMAGE',
    adData: {
      pageName: 'Nike Poland',
      adArchiveID: '1234567900',
      body: 'Nike ACG - ekwipunek na każdą przygodę.',
      title: 'All Conditions Gear',
      ctaText: 'Eksploruj',
      linkUrl: 'https://nike.com/acg',
      publisherPlatform: 'Facebook',
      image: {
        original_url: 'https://picsum.photos/800/800?random=15',
        resized_url: 'https://picsum.photos/400/400?random=15'
      }
    }
  },
  {
    success: true,
    adType: 'CAROUSEL',
    adData: {
      pageName: 'Nike Poland',
      adArchiveID: '1234567901',
      body: 'Nike Running - wszystko do biegania w jednym miejscu.',
      publisherPlatform: 'Facebook',
      cards: [
        {
          title: 'Buty biegowe',
          body: 'Lekkie i szybkie',
          imageUrl: 'https://picsum.photos/400/400?random=16',
          linkUrl: 'https://nike.com/running-shoes',
          ctaText: 'Wybierz'
        },
        {
          title: 'Odzież biegowa',
          body: 'Oddychająca i wygodna',
          imageUrl: 'https://picsum.photos/400/400?random=17',
          linkUrl: 'https://nike.com/running-apparel',
          ctaText: 'Zobacz'
        },
        {
          title: 'Akcesoria',
          body: 'Niezbędne gadżety',
          imageUrl: 'https://picsum.photos/400/400?random=18',
          linkUrl: 'https://nike.com/running-gear',
          ctaText: 'Kup'
        },
        {
          title: 'Zegarki sportowe',
          body: 'Śledź swoje postępy',
          imageUrl: 'https://picsum.photos/400/400?random=19',
          linkUrl: 'https://nike.com/watches',
          ctaText: 'Sprawdź'
        }
      ]
    }
  },
  // Additional ads for testing
  {
    success: true,
    adType: 'IMAGE',
    adData: {
      pageName: 'Nike Poland',
      adArchiveID: '1234567902',
      body: 'Nike Metcon - buty do crossfitu numer 1 na świecie.',
      title: 'Nike Metcon 8',
      ctaText: 'Trenuj lepiej',
      linkUrl: 'https://nike.com/metcon',
      publisherPlatform: 'Instagram',
      image: {
        original_url: 'https://picsum.photos/800/800?random=20',
        resized_url: 'https://picsum.photos/400/400?random=20'
      }
    }
  },
  {
    success: true,
    adType: 'VIDEO',
    adData: {
      pageName: 'Nike Poland',
      adArchiveID: '1234567903',
      body: 'Nike Football. Graj jak mistrz świata.',
      title: 'Play Like a Champion',
      ctaText: 'Zobacz kolekcję',
      linkUrl: 'https://nike.com/football',
      publisherPlatform: 'Facebook',
      previewImageUrl: 'https://picsum.photos/400/400?random=21',
      videoUrls: {
        hd: 'https://example.com/football-hd.mp4',
        sd: 'https://example.com/football-sd.mp4'
      }
    }
  }
];

export function generateMockData(pageId: string): AdData[] {
  // Return mock data with randomized order
  return [...mockAds].sort(() => Math.random() - 0.5);
}