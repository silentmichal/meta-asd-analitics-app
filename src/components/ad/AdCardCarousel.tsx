import { useState, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AdCard } from '@/types/ad.types';

interface AdCardCarouselProps {
  cards: AdCard[];
  typeIcon?: ReactNode;
}

export default function AdCardCarousel({ cards, typeIcon }: AdCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };
  
  if (!cards || cards.length === 0) return null;
  
  const currentCard = cards[currentIndex];
  
  return (
    <div className="relative">
      {/* Image/Video Display */}
      <div className="relative aspect-[1.91/1] bg-muted overflow-hidden">
        {currentCard.videoUrls && (currentCard.videoUrls.hd || currentCard.videoUrls.sd) ? (
          <video
            src={currentCard.videoUrls.hd || currentCard.videoUrls.sd || ''}
            poster={currentCard.previewImageUrl || currentCard.imageUrl}
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={currentCard.imageUrl}
            alt={currentCard.title || 'Ad image'}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        )}

        {/* Type Badge */}
        {typeIcon && (
          <div className="absolute top-3 right-3 w-6 h-6 bg-background/80 rounded-full flex items-center justify-center">
            {typeIcon}
          </div>
        )}
        
        {/* Navigation Buttons */}
        {cards.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 hover:bg-background rounded-full flex items-center justify-center shadow-md transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 hover:bg-background rounded-full flex items-center justify-center shadow-md transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
        
        {/* Slide Indicators */}
        {cards.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-background w-4' 
                    : 'bg-background/50 hover:bg-background/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Card Text Content */}
      {(currentCard.title || currentCard.body) && (
        <div className="p-3 sm:p-4">
          {currentCard.title && (
            <h4 className="font-medium text-sm mb-1 line-clamp-1">{currentCard.title}</h4>
          )}
          {currentCard.body && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {currentCard.body}
            </p>
          )}
        </div>
      )}
    </div>
  );
}