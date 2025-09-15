import { BeamsBackground } from '@/components/ui/beams-background';
import { GooeyLoader } from '@/components/ui/loader-10';
import { FileText, Sparkles, Brain, ChartBar } from 'lucide-react';
import { useEffect, useState } from 'react';

const loadingSteps = [
  "Analizowanie strategii reklamowych...",
  "Przetwarzanie danych demograficznych...",
  "Identyfikowanie haków reklamowych...",
  "Generowanie rekomendacji taktycznych...",
  "Przygotowywanie wizualizacji...",
  "Finalizowanie raportu..."
];

export default function ReportLoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <BeamsBackground intensity="medium">
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-lg">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <GooeyLoader
                primaryColor="hsl(var(--primary))"
                secondaryColor="hsl(var(--primary-glow))"
                borderColor="hsl(var(--primary))"
                className="scale-150"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="w-8 h-8 text-primary animate-pulse" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">
              Generowanie Raportu Strategicznego
            </h2>
            
            <div className="flex justify-center gap-3 mb-4">
              <Brain className="w-5 h-5 text-primary animate-pulse" />
              <Sparkles className="w-5 h-5 text-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
              <ChartBar className="w-5 h-5 text-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            
            <div className="space-y-2">
              <p className="text-lg text-white/90 font-medium min-h-[28px] transition-all duration-300">
                {loadingSteps[currentStep]}
              </p>
              <p className="text-white/60">
                Analizujemy dane i przygotowujemy szczegółowy raport
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-6 border border-white/20">
              <p className="text-sm text-white/80">
                <span className="text-primary font-semibold">Uwaga:</span> Generowanie kompleksowego raportu może potrwać kilkadziesiąt sekund. 
                Analizujemy wszystkie aspekty kampanii reklamowych, aby dostarczyć Ci najlepsze rekomendacje strategiczne.
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </BeamsBackground>
  );
}