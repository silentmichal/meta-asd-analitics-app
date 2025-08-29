interface DcoVersionBarProps {
  count: number;
  selectedIndex: number;
  onSelect: (i: number) => void;
}

export default function DcoVersionBar({ count, selectedIndex, onSelect }: DcoVersionBarProps) {
  if (!count || count < 2) return null;

  return (
    <div className="px-3 sm:px-4 pt-2 pb-3">
      <div className="grid grid-cols-3 gap-1 bg-muted/60 rounded-lg p-1">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`py-1.5 text-xs font-medium rounded-md transition-all ${
              selectedIndex === index ? 'bg-card shadow-sm' : 'hover:bg-muted text-muted-foreground'
            }`}
            aria-pressed={selectedIndex === index}
            aria-label={`Wersja ${index + 1}`}
          >
            Wersja {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}