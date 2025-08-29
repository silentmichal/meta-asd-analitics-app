import { formatPlatform } from '@/utils/adUtils';

interface AdCardHeaderProps {
  pageName: string;
  profilePicUrl?: string | null;
  platform: string;

  // meta do 2. linii (opcjonalne; przekazywane z widoku przez ad.basic?.json)
  startDate?: string;
  stopDate?: string | null;
  platforms?: string[]; // ["facebook","instagram","messenger"]
}

function formatDate(d?: string | null) {
  if (!d) return '';
  // oczekiwany format "YYYY-MM-DD"
  const parts = d.split('-');
  if (parts.length !== 3) return d;
  const [y, m, day] = parts.map((x) => Number(x));
  if (!y || !m || !day) return d;
  const dd = String(day).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  return `${dd}.${mm}.${y}`; // dd.MM.yyyy
}

function prettyPlatform(name: string) {
  const n = (name || '').trim().toLowerCase();
  if (n === 'fb' || n === 'facebook') return 'Facebook';
  if (n === 'ig' || n === 'instagram') return 'Instagram';
  if (n === 'messenger') return 'Messenger';
  if (n === 'audience network' || n === 'audience_network') return 'Audience Network';
  return n ? n.charAt(0).toUpperCase() + n.slice(1) : '';
}

export default function AdCardHeader({
  pageName,
  profilePicUrl,
  platform,
  startDate,
  stopDate,
  platforms
}: AdCardHeaderProps) {
  const datesText = startDate ? `${formatDate(startDate)}${stopDate ? ` – ${formatDate(stopDate)}` : ''}` : '';
  const platformsText =
    Array.isArray(platforms) && platforms.length ? platforms.map(prettyPlatform).join(' · ') : '';

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

          {/* linia 1 – bez zmian */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Sponsorowane</span>
            <span>·</span>
            <span>{formatPlatform(platform)}</span>
          </div>

          {/* linia 2 – daty i/lub platformy */}
          {(datesText || platformsText) && (
            <div className="mt-0.5 text-xs text-muted-foreground">
              {datesText && <span>{datesText}</span>}
              {datesText && platformsText && <span> · </span>}
              {platformsText && <span>{platformsText}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}