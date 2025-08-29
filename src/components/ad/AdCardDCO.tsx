import { useState } from 'react';
import { AdCard } from '@/types/ad.types';
import AdCardMedia from './AdCardMedia';

interface AdCardDCOProps {
  cards: AdCard[];
}

export default function AdCardDCO({ cards }: AdCardDCOProps) {
  const [selectedVersion, setSelectedVersion] = useState(0);
  
  if (!cards || cards.length === 0) return null;
  if (cards.length === 1) {
    return <AdCardMedia card={cards[0]} />;
  }
  
  const currentCard = cards[selectedVersion];
  
  return (
    <div>
      {/* Najpierw media */}
      <AdCardMedia card={currentCard} />
      
      {/* Wersje POD mediami (segmented control) */}
      <div className="px-3 sm:px-4 pt-2 pb-1">
        <div className="grid grid-cols-3 gap-1 bg-muted/60 rounded-lg p-1">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedVersion(index)}
              className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                selectedVersion === index
                  ? 'bg-card shadow-sm'
                  : 'hover:bg-muted text-muted-foreground'
              }`}
              aria-pressed={selectedVersion === index}
              aria-label={`Wersja ${index + 1}`}
            >
              Wersja {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}