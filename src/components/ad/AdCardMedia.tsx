import { Play } from 'lucide-react';
import { AdCard } from '@/types/ad.types';
import { ReactNode } from 'react';

interface AdCardMediaProps {
  card: AdCard;
  typeIcon?: ReactNode;
}

export default function AdCardMedia({ card, typeIcon }: AdCardMediaProps) {
  const isVideo = card.videoUrls && (card.videoUrls.hd || card.videoUrls.sd);

  return (
    <div>
      {/* Ramka o stałych proporcjach; media w środku są skalowane bez przycięcia */}
      <div className="relative aspect-[1.91/1] bg-muted overflow-hidden flex items-center justify-center">
        {isVideo ? (
          <>
            <img
              src={card.previewImageUrl || card.imageUrl}
              alt={card.title || 'Video thumbnail'}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 bg-background/80 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 ml-1" />
              </div>
            </div>
          </>
        ) : (
          <img
            src={card.imageUrl}
            alt={card.title || 'Ad image'}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        )}

        {/* Badge typu na samym media */}
        {typeIcon && (
          <div className="absolute top-3 right-3 w-6 h-6 bg-background/80 rounded-full flex items-center justify-center">
            {typeIcon}
          </div>
        )}
      </div>

      {(card.title || card.body) && (
        <div className="p-3 sm:p-4">
          {card.title && <h4 className="font-medium text-sm mb-1 line-clamp-1">{card.title}</h4>}
          {card.body && <p className="text-sm text-muted-foreground line-clamp-3">{card.body}</p>}
        </div>
      )}
    </div>
  );
}