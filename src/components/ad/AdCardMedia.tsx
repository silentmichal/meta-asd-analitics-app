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
    <div className="relative bg-muted overflow-hidden">
      {/* Media tylko – bez żadnych tytułów/opisów pod spodem */}
      {isVideo ? (
        <>
          <img
            src={card.previewImageUrl || card.imageUrl}
            alt={card.title || 'Video thumbnail'}
            className="w-full h-auto object-contain"
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
          className="w-full h-auto object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
      )}

      {/* Badge typu (opcjonalny) */}
      {typeIcon && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-background/80 rounded-full flex items-center justify-center">
          {typeIcon}
        </div>
      )}
    </div>
  );
}