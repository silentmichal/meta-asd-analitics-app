import { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { validateFacebookPageId } from '@/utils/adUtils';
import { loadLastPageId, saveLastPageId } from '@/utils/localStorage';
import { toast } from 'sonner';

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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-xl p-8 md:p-12 shadow-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
              <Target className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-2 text-foreground">
              Analizuj Konkurencję
            </h1>
            <p className="text-muted-foreground text-base">
              Pobierz i analizuj reklamy z Facebook Ads Library
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="pageId" className="block text-sm font-medium mb-2">
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
                className="input-base"
                disabled={isLoading}
                autoComplete="off"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-destructive">{error}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full h-14 text-base font-semibold"
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
          
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Wprowadź ID strony Facebook lub jej nazwę użytkownika, aby pobrać wszystkie aktywne reklamy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}