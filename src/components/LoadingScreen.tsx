export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <div className="text-center">
        <div className="spinner mb-6" />
        <p className="text-lg text-card animate-pulse">Pobieranie reklam...</p>
      </div>
    </div>
  );
}