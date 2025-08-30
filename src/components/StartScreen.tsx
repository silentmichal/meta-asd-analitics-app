import { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { validateFacebookPageId } from '@/utils/adUtils';
import { loadLastPageId, saveLastPageId } from '@/utils/localStorage';
import { toast } from 'sonner';
import { BeamsBackground } from '@/components/ui/beams-background';

interface StartScreenProps {
  onSubmit: (pageId: string) => void;
}

export default function StartScreen({ onSubmit }: StartScreenProps) {
  const [pageId, setPageId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const lastPageId = loadLastPageId();
    if (lastPageId) {
      setPageId(lastPageId);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const trimmedId = pageId.trim();
    
    if (!trimmedId) {
      setError('Proszę wprowadzić ID strony');
      toast.error('Proszę wprowadzić ID strony');
      return;
    }
    
    if (!validateFacebookPageId(trimmedId)) {
      setError('Nieprawidłowy format ID strony Facebook');
      toast.error('Nieprawidłowy format ID strony Facebook');
      return;
    }
    
    setIsLoading(true);
    saveLastPageId(trimmedId);
    
    // Simulate API call delay
    setTimeout(() => {
      onSubmit(trimmedId);
    }, 500);
  };

  return (
    <BeamsBackground intensity="medium">
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-6">
                <Target className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
                Analizuj Konkurencję
              </h1>
              <p className="text-white/70">
                Pobierz i analizuj reklamy z Facebook Ads Library
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="pageId" className="block text-sm font-medium mb-2 text-white/90">
                  ID Strony Facebook
                </label>
                <input
                  id="pageId"
                  type="text"
                  value={pageId}
                  onChange={(e) => {
                    setPageId(e.target.value);
                    setError('');
                  }}
                  placeholder="np. 12345678901234 lub nazwa-strony"
                  className="input-base bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary"
                  disabled={isLoading}
                  autoComplete="off"
                  autoFocus
                />
                {error && (
                  <p className="mt-2 text-sm text-red-400">{error}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="spinner w-5 h-5 border-2" />
                    <span>Przetwarzanie...</span>
                  </div>
                ) : (
                  'Pobierz Reklamy'
                )}
              </button>
            </form>
            
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-xs text-white/50 text-center">
                Wprowadź ID strony Facebook lub jej nazwę użytkownika, aby pobrać wszystkie aktywne reklamy
              </p>
            </div>
          </div>
        </div>
      </div>
    </BeamsBackground>
  );
}