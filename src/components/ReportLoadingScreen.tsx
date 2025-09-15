import { BeamsBackground } from '@/components/ui/beams-background';
import { GooeyLoader } from '@/components/ui/loader-10';
import { FileText, Sparkles, Brain, ChartBar, Clock, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

const loadingSteps = [
  "Analizowanie strategii reklamowych...",
  "Przetwarzanie danych demograficznych...",
  "Identyfikowanie haków reklamowych...",
  "Generowanie rekomendacji taktycznych...",
  "Przygotowywanie wizualizacji...",
  "Finalizowanie raportu..."
];

interface ReportLoadingScreenProps {
  estimatedTime?: number; // in seconds
  totalVariants?: number;
}

export default function ReportLoadingScreen({ estimatedTime = 60, totalVariants }: ReportLoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(estimatedTime);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 2000);

    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        const newTime = prev - 1;
        setProgress(((estimatedTime - newTime) / estimatedTime) * 100);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [estimatedTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
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
            
            {/* Time estimation section */}
            <div className="space-y-4 w-full max-w-md mx-auto mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-3 border border-white/20">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-white/80">Szacowany czas pozostały:</span>
                  </div>
                  <span className="font-mono font-semibold text-primary">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                
                <Progress value={progress} className="h-2" />
                
                {totalVariants && (
                  <div className="text-xs text-white/70 text-center">
                    Analizowanie {totalVariants} {totalVariants === 1 ? 'wariantu' : 'wariantów'} reklam
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2 text-xs text-white/60">
                <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <p>
                  Jest to szacowany czas na podstawie {totalVariants ? `${totalVariants} wariantów reklam` : 'ilości danych'}. 
                  Rzeczywisty czas przetwarzania może się różnić w zależności od obciążenia serwera i złożoności danych.
                </p>
              </div>
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