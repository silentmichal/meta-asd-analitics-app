import { BeamsBackground } from '@/components/ui/beams-background';
import { GooeyLoader } from '@/components/ui/loader-10';

export default function LoadingScreen() {
  return (
    <BeamsBackground intensity="medium">
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <GooeyLoader
            primaryColor="hsl(var(--primary))"
            secondaryColor="hsl(var(--primary-glow))"
            borderColor="hsl(var(--primary))"
            className="scale-125"
          />
          
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