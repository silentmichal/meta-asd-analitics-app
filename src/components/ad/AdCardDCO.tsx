import { useState } from 'react';
import { AdCard } from '@/types/ad.types';
import AdCardCarousel from './AdCardCarousel';
import AdCardMedia from './AdCardMedia';

interface AdCardDCOProps {
  cards: AdCard[];
}

export default function AdCardDCO({ cards }: AdCardDCOProps) {
  const [selectedVersion, setSelectedVersion] = useState(0);
  
  if (!cards || cards.length === 0) return null;
  
  // If only one card, just display it
  if (cards.length === 1) {
    return <AdCardMedia card={cards[0]} />;
  }
  
  const currentCard = cards[selectedVersion];
  
  return (
    <div>
      {/* Version Selector */}
      <div className="flex gap-1 p-3 sm:p-4 pb-0">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedVersion(index)}
            className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-all ${
              selectedVersion === index
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            }`}
          >
            Wersja {index + 1}
          </button>
        ))}
      </div>
      
      {/* Display Current Version */}
      <AdCardMedia card={currentCard} />
    </div>
  );
}