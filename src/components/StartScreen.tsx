import { useState, useEffect } from 'react';
import { validateFacebookPageId } from '@/utils/adUtils';
import { loadLastPageId, saveLastPageId } from '@/utils/localStorage';
import { toast } from 'sonner';
import { BeamsBackground } from '@/components/ui/beams-background';
import { AnimatedText } from '@/components/ui/animated-underline-text-one';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/neon-button';

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
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Main header with animated underline only on "reklamy" */}
        <div className="flex flex-col items-center justify-center gap-2 mb-12">
          <div className="flex items-center gap-3">
            <motion.span
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-[0_0_30px_rgba(147,51,234,0.5)]"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Analizuj
            </motion.span>
            <AnimatedText 
              text="reklamy"
              textClassName="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-[0_0_30px_rgba(147,51,234,0.5)]"
              underlineClassName="text-purple-400"
              underlineDuration={1.5}
            />
            <motion.span
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-[0_0_30px_rgba(147,51,234,0.5)]"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              konkurencji
            </motion.span>
          </div>
        </div>
        
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="pageId" className="block text-sm font-medium mb-2 text-white/90">
                  Wklej ID strony Facebooka
                </label>
                <input
                  id="pageId"
                  type="text"
                  value={pageId}
                  onChange={(e) => {
                    setPageId(e.target.value);
                    setError('');
                  }}
                  placeholder="12345678901234"
                  className="w-full h-11 px-4 bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200"
                  disabled={isLoading}
                  autoComplete="off"
                  autoFocus
                />
                {error && (
                  <p className="mt-2 text-sm text-red-400">{error}</p>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                variant="solid"
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Przetwarzanie...</span>
                  </div>
                ) : (
                  'Pobierz Reklamy'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </BeamsBackground>
  );
}