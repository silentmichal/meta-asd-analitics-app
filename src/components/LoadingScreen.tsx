export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-border border-t-accent rounded-full animate-spin mb-4" />
        <p className="text-base text-muted-foreground">Pobieranie reklam...</p>
      </div>
    </div>
  );
}