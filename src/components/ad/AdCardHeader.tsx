import { formatPlatform, formatDateRange, getPlatformIconName } from '@/utils/adUtils';
import { Facebook, Instagram, MessageCircle, Globe } from 'lucide-react';

interface AdCardHeaderProps {
  pageName: string;
  profilePicUrl?: string | null;
  platform: string;
  platforms?: string[];
  startDate?: string;
  endDate?: string;
}

const platformIcons: { [key: string]: any } = {
  'Facebook': Facebook,
  'Instagram': Instagram,
  'MessageCircle': MessageCircle,
  'Globe': Globe
};

export default function AdCardHeader({ 
  pageName, 
  profilePicUrl, 
  platform, 
  platforms,
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
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm truncate">{pageName}</h3>
            {platforms && platforms.length > 0 && (
              <div className="flex items-center gap-1">
                {platforms.map((platform, index) => {
                  const iconName = getPlatformIconName(platform);
                  const Icon = platformIcons[iconName];
                  return Icon ? (
                    <Icon 
                      key={index} 
                      className="w-3.5 h-3.5 text-muted-foreground" 
                      title={platform}
                    />
                  ) : null;
                })}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Sponsorowane</span>
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