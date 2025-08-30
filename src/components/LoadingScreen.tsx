import { Loader2 } from 'lucide-react';
import { BeamsBackground } from '@/components/ui/beams-background';

export default function LoadingScreen() {
  return (
    <BeamsBackground intensity="medium">
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-primary/20 rounded-full" />
            </div>
            <div className="relative flex items-center justify-center">
              <Loader2 className="w-32 h-32 text-primary animate-spin" />
            </div>
          </div>
          
          <div className="mt-8 space-y-2">
            <h2 className="text-2xl font-semibold text-white">
              Pobieranie reklam...
            </h2>
            <p className="text-white/70">
              To może potrwać kilka sekund
            </p>
          </div>
          
          <div className="mt-8 flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </BeamsBackground>
  );
}