import { useState, useEffect } from 'react';
import StartScreen from '@/components/StartScreen';
import LoadingScreen from '@/components/LoadingScreen';
import Dashboard from '@/components/Dashboard';
import { AdData, StoredAnalysis } from '@/types/ad.types';
import { fetchAdsFromWebhook } from '@/services/adService';
import { saveAnalysis, loadAnalysis } from '@/utils/localStorage';
import { toast } from 'sonner';

type AppState = 'start' | 'loading' | 'dashboard';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('start');
  const [ads, setAds] = useState<AdData[]>([]);
  const [pageName, setPageName] = useState('');
  const [pageId, setPageId] = useState('');

  useEffect(() => {
    // Check if there's stored analysis on mount
    const stored = loadAnalysis();
    if (stored && stored.ads.length > 0) {
      setAds(stored.ads);
      setPageName(stored.pageName);
      setPageId(stored.pageId);
      setAppState('dashboard');
      toast.success('Przywrócono poprzednią analizę');
    }
  }, []);

  const handlePageIdSubmit = async (submittedPageId: string) => {
    setPageId(submittedPageId);
    setAppState('loading');
    
    try {
      // Fetch real data from webhook
      const { ads: fetchedAds, pageName: fetchedPageName } = await fetchAdsFromWebhook(submittedPageId);
      
      if (fetchedAds.length === 0) {
        toast.error('Nie znaleziono żadnych reklam dla tej strony');
        setAppState('start');
        return;
      }
      
      const analysis: StoredAnalysis = {
        timestamp: new Date().toISOString(),
        pageName: fetchedPageName,
        pageId: submittedPageId,
        totalAds: fetchedAds.length,
        ads: fetchedAds
      };
      
      // Save to localStorage
      saveAnalysis(analysis);
      
      // Update state
      setAds(fetchedAds);
      setPageName(fetchedPageName);
      setAppState('dashboard');
      
      toast.success(`Pobrano ${fetchedAds.length} reklam z ${fetchedPageName}`);
    } catch (error) {
      console.error('Error fetching ads:', error);
      toast.error('Wystąpił błąd podczas pobierania danych. Spróbuj ponownie.');
      setAppState('start');
    }
  };

  const handleBack = () => {
    setAppState('start');
  };

  switch (appState) {
    case 'start':
      return <StartScreen onSubmit={handlePageIdSubmit} />;
    case 'loading':
      return <LoadingScreen />;
    case 'dashboard':
      return <Dashboard ads={ads} pageName={pageName} onBack={handleBack} />;
    default:
      return <StartScreen onSubmit={handlePageIdSubmit} />;
  }
};

export default Index;
