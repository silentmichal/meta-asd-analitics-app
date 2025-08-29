import { formatPlatform, formatDateRange } from '@/utils/adUtils';

interface AdCardHeaderProps {
  pageName: string;
  profilePicUrl?: string | null;
  platform: string;
  platforms?: string[];
  startDate?: string;
  endDate?: string;
}

export default function AdCardHeader({ 
  pageName, 
  profilePicUrl, 
  platform, 
  startDate,
  endDate 
}: AdCardHeaderProps) {
  return (
    <div className="flex items-start justify-between p-3 sm:p-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          {profilePicUrl ? (
            <img 
              src={profilePicUrl} 
              alt={pageName}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-semibold text-muted-foreground">
                {pageName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{pageName}</h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Sponsorowane</span>
            <span>·</span>
            <span>{formatPlatform(platform)}</span>
          </div>
          {startDate && (
            <div className="text-xs text-muted-foreground mt-0.5">
              {formatDateRange(startDate, endDate)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}