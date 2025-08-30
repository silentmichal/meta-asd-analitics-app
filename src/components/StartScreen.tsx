import { useState, useEffect } from 'react';
import { validateFacebookPageId } from '@/utils/adUtils';
import { loadLastPageId, saveLastPageId } from '@/utils/localStorage';
import { toast } from 'sonner';
import { BeamsBackground } from '@/components/ui/beams-background';
import { AnimatedText } from '@/components/ui/animated-underline-text-one';
import { motion } from 'motion/react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { AdStatus, AdFilters } from '@/types/ad.types';

interface StartScreenProps {
  onSubmit: (filters: AdFilters) => void;
}

export default function StartScreen({ onSubmit }: StartScreenProps) {
  const [pageId, setPageId] = useState('');
  const [status, setStatus] = useState<AdStatus>('ALL');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
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

    // Validate date range
    if (dateFrom && dateTo && dateFrom > dateTo) {
      toast.error('Data końcowa nie może być wcześniejsza niż data początkowa');
      return;
    }
    
    setIsLoading(true);
    saveLastPageId(trimmedId);
    
    const filters: AdFilters = {
      pageId: trimmedId,
      status: status !== 'ALL' ? status : undefined,
      dateFrom: dateFrom ? format(dateFrom, 'yyyy-MM-dd') : undefined,
      dateTo: dateTo ? format(dateTo, 'yyyy-MM-dd') : undefined
    };
    
    // Simulate API call delay
    setTimeout(() => {
      onSubmit(filters);
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
                  Wklej ID strony Facebooka <span className="text-red-400">*</span>
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

              <div>
                <label className="block text-sm font-medium mb-3 text-white/90">
                  Status reklam <span className="text-white/50">(opcjonalne)</span>
                </label>
                <RadioGroup value={status} onValueChange={(value: AdStatus) => setStatus(value)}>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ALL" id="all" className="border-white/40 text-purple-400" />
                      <Label htmlFor="all" className="text-white/80 cursor-pointer">Wszystkie</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ACTIVE" id="active" className="border-white/40 text-purple-400" />
                      <Label htmlFor="active" className="text-white/80 cursor-pointer">Aktywne</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="INACTIVE" id="inactive" className="border-white/40 text-purple-400" />
                      <Label htmlFor="inactive" className="text-white/80 cursor-pointer">Nieaktywne</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/90">
                    Data od <span className="text-white/50">(opcjonalne)</span>
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-full h-11 px-3 bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg text-left text-white hover:border-purple-400/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 flex items-center justify-between"
                      >
                        {dateFrom ? format(dateFrom, 'dd.MM.yyyy') : <span className="text-white/50">Wybierz</span>}
                        <CalendarIcon className="h-4 w-4 text-white/50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-black/90 backdrop-blur-md border-white/20" align="start">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                        className="bg-transparent text-white"
                        locale={pl}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/90">
                    Data do <span className="text-white/50">(opcjonalne)</span>
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-full h-11 px-3 bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg text-left text-white hover:border-purple-400/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 flex items-center justify-between"
                        disabled={!dateFrom}
                      >
                        {dateTo ? format(dateTo, 'dd.MM.yyyy') : <span className="text-white/50">Wybierz</span>}
                        <CalendarIcon className="h-4 w-4 text-white/50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-black/90 backdrop-blur-md border-white/20" align="start">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        disabled={(date) => dateFrom ? date < dateFrom : false}
                        initialFocus
                        className="bg-transparent text-white"
                        locale={pl}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 px-6 bg-white text-black font-semibold rounded-lg transition-all duration-200 hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Przetwarzanie...</span>
                  </div>
                ) : (
                  'Pobierz Reklamy'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </BeamsBackground>
  );
}