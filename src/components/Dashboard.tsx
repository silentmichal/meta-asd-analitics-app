import { useState, useEffect } from 'react';
import { Bot, ArrowLeft } from 'lucide-react';
import { AdData } from '@/types/ad.types';
import AdCard from './AdCard';
import Pagination from './Pagination';
import { toast } from 'sonner';

interface DashboardProps {
  ads: AdData[];
  pageName: string;
  onBack: () => void;
}

const ADS_PER_PAGE = 12;

export default function Dashboard({ ads, pageName, onBack }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedAds, setDisplayedAds] = useState<AdData[]>([]);
  
  const totalPages = Math.ceil(ads.length / ADS_PER_PAGE);
  
  useEffect(() => {
    const startIndex = (currentPage - 1) * ADS_PER_PAGE;
    const endIndex = startIndex + ADS_PER_PAGE;
    setDisplayedAds(ads.slice(startIndex, endIndex));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, ads]);
  
  const handleAnalyzeAI = () => {
    const analysisData = {
      pageName,
      totalAds: ads.length,
      adTypes: {
        image: ads.filter(ad => ad.adType === 'IMAGE').length,
        video: ads.filter(ad => ad.adType === 'VIDEO').length,
        carousel: ads.filter(ad => ad.adType === 'CAROUSEL').length,
        dco: ads.filter(ad => ad.adType === 'DCO').length,
      },
      platforms: {
        facebook: ads.filter(ad => ad.adData.publisherPlatform === 'Facebook').length,
        instagram: ads.filter(ad => ad.adData.publisherPlatform === 'Instagram').length,
      },
      sample: ads.slice(0, 5)
    };
    
    console.log('AI Analysis Data:', analysisData);
    toast.success('Dane przygotowane do analizy AI');
    
    setTimeout(() => {
      toast.info('Analiza AI zostanie wkrótce udostępniona');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">{pageName}</h1>
                <p className="text-muted-foreground">
                  {ads.length} {ads.length === 1 ? 'reklama' : 'reklam'} znalezionych
                </p>
              </div>
            </div>
            <button
              onClick={handleAnalyzeAI}
              className="btn-primary flex items-center gap-2"
            >
              <Bot className="w-5 h-5" />
              <span>Analizuj AI</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {ads.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-4">
              <Bot className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Brak reklam</h2>
            <p className="text-muted-foreground">
              Nie znaleziono żadnych reklam dla tej strony
            </p>
          </div>
        ) : (
          <>
            {/* Ads Grid */}
            <div className="ads-grid mb-8">
              {displayedAds.map((ad, index) => (
                <AdCard key={`${ad.adData.adArchiveID}-${index}`} ad={ad} />
              ))}
            </div>
            
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={ads.length}
              itemsPerPage={ADS_PER_PAGE}
            />
          </>
        )}
      </main>
    </div>
  );
}