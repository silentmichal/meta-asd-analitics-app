import { useState, useEffect, useMemo } from 'react';
import { Bot, ArrowLeft, Calendar, BarChart3, Globe, FileText, Layers } from 'lucide-react';
import { AdData } from '@/types/ad.types';
import { StrategicReportData } from '@/types/strategic-report.types';
import AdCard from './AdCard';
import Pagination from './Pagination';
import StrategicReport from './StrategicReport';
import LoadingScreen from './LoadingScreen';
import ReportLoadingScreen from './ReportLoadingScreen';
import { generateStrategicReport } from '@/services/reportService';
import { countAdVariants } from '@/utils/adUtils';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface DashboardProps {
  ads: AdData[];
  pageName: string;
  onBack: () => void;
}

const ADS_PER_PAGE = 12;

export default function Dashboard({ ads, pageName, onBack }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedAds, setDisplayedAds] = useState<AdData[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState<StrategicReportData | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  const totalPages = Math.ceil(ads.length / ADS_PER_PAGE);
  
  // Calculate statistics
  const stats = useMemo(() => {
    if (ads.length === 0) return null;
    
    // Get profile picture URL from first ad
    const profilePicUrl = ads[0]?.adData?.profilePicUrl || null;
    
    // Calculate date range from basic info
    const dates = ads
      .map(ad => ad.basic?.ad_creation_time)
      .filter(date => date)
      .map(date => new Date(date).getTime());
    
    const minDate = dates.length > 0 ? new Date(Math.min(...dates)) : null;
    const maxDate = dates.length > 0 ? new Date(Math.max(...dates)) : null;
    
    // Calculate platform stats
    const platformStats = {
      facebook: ads.filter(ad => ad.adData.publisherPlatform === 'Facebook').length,
      instagram: ads.filter(ad => ad.adData.publisherPlatform === 'Instagram').length,
    };
    
    // Count total ad variants
    const totalVariants = countAdVariants(ads);
    
    return {
      profilePicUrl,
      dateRange: minDate && maxDate ? { start: minDate, end: maxDate } : null,
      platformStats,
      totalAds: ads.length,
      totalVariants
    };
  }, [ads]);
  
  useEffect(() => {
    const startIndex = (currentPage - 1) * ADS_PER_PAGE;
    const endIndex = startIndex + ADS_PER_PAGE;
    setDisplayedAds(ads.slice(startIndex, endIndex));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, ads]);
  
  const handleAnalyzeAI = async () => {
    setShowConfirmDialog(false);
    setIsGeneratingReport(true);
    
    try {
      // Generate report via API
      const reportResponse = await generateStrategicReport(ads);
      
      // Process the API response
      if (reportResponse) {
        setReportData(reportResponse);
        setIsGeneratingReport(false);
        setShowReport(true);
        toast.success('Raport strategiczny został wygenerowany!');
      } else {
        throw new Error('Nieprawidłowa odpowiedź z API');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Błąd podczas generowania raportu. Spróbuj ponownie.');
      setIsGeneratingReport(false);
    }
  };

  const handleBackFromReport = () => {
    setShowReport(false);
    setReportData(null);
  };

  // Show loading screen when generating report
  if (isGeneratingReport) {
    const totalVariants = countAdVariants(ads);
    const estimatedTimeInSeconds = totalVariants * 40;
    
    return (
      <ReportLoadingScreen 
        estimatedTime={estimatedTimeInSeconds}
        totalVariants={totalVariants}
      />
    );
  }

  // Show report if generated
  if (showReport && reportData) {
    return <StrategicReport data={reportData} onBack={handleBackFromReport} />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4">
            {/* Top Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={onBack}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                {/* Company Info with Logo */}
                <div className="flex items-center gap-3">
                  {stats?.profilePicUrl && (
                    <Avatar className="h-10 w-10 border-2 border-border">
                      <AvatarImage src={stats.profilePicUrl} alt={pageName} />
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        {pageName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold">{pageName}</h1>
                    <p className="text-sm text-muted-foreground">
                      Analiza reklam Meta
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowConfirmDialog(true)}
                  variant="outline"
                  className="border-primary/30 hover:border-primary hover:bg-primary/5 text-primary"
                >
                  <FileText className="w-5 h-5" />
                  <span>Raport strategiczny</span>
                </Button>
              </div>
            </div>
            
            {/* Statistics Row */}
            {stats && (
              <div className="flex flex-wrap gap-3 ml-14">
                {/* Total Ads */}
                <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 border-primary/20">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span className="font-medium">{stats.totalAds}</span>
                  <span className="text-xs text-muted-foreground">
                    {stats.totalAds === 1 ? 'reklama' : 'reklam'}
                  </span>
                </Badge>
                
                {/* Total Variants (only show if different from total ads) */}
                {stats.totalVariants > stats.totalAds && (
                  <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 border-purple-500/20">
                    <Layers className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">{stats.totalVariants}</span>
                    <span className="text-xs text-muted-foreground">
                      {stats.totalVariants === 1 ? 'wariant' : 'wariantów'}
                    </span>
                  </Badge>
                )}
                
                {/* Date Range */}
                {stats.dateRange && (
                  <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 border-secondary/20">
                    <Calendar className="w-4 h-4 text-secondary" />
                    <span className="text-xs">
                      {format(stats.dateRange.start, 'dd MMM yyyy', { locale: pl })} - 
                      {format(stats.dateRange.end, 'dd MMM yyyy', { locale: pl })}
                    </span>
                  </Badge>
                )}
                
                {/* Platforms */}
                {(stats.platformStats.facebook > 0 || stats.platformStats.instagram > 0) && (
                  <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 border-accent/20">
                    <Globe className="w-4 h-4 text-accent" />
                    <div className="flex items-center gap-2 text-xs">
                      {stats.platformStats.facebook > 0 && (
                        <span>Facebook: {stats.platformStats.facebook}</span>
                      )}
                      {stats.platformStats.instagram > 0 && (
                        <span>Instagram: {stats.platformStats.instagram}</span>
                      )}
                    </div>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generowanie raportu strategicznego</AlertDialogTitle>
            <AlertDialogDescription>
              Czy chcesz wygenerować szczegółowy raport strategiczny na podstawie analizy {ads.length} reklam? 
              Raport zawiera analizę demograficzną, anatomię przekazu oraz rekomendacje taktyczne.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={handleAnalyzeAI} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Generuj raport
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
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