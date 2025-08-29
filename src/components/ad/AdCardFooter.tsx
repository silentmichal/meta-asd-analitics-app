import { extractDomain, getPlatformIconName } from '@/utils/adUtils';
import { ExternalLink, Facebook, Instagram, MessageCircle, Globe } from 'lucide-react';

interface AdCardFooterProps {
  linkUrl?: string;
  ctaText?: string;
  title?: string;
  linkDescription?: string;
  platforms?: string[];
}

const platformIcons: { [key: string]: any } = {
  'Facebook': Facebook,
  'Instagram': Instagram,
  'MessageCircle': MessageCircle,
  'Globe': Globe
};

export default function AdCardFooter({ linkUrl, ctaText, title, linkDescription, platforms }: AdCardFooterProps) {
  if (!linkUrl) return null;

  const domain = extractDomain(linkUrl);
  const showLinkDescription =
    typeof linkDescription === 'string' &&
    linkDescription.trim() !== '' &&
    linkDescription.trim().toLowerCase() !== 'no';

  return (
    <div className="p-3 sm:p-4 pt-0">
      <div className="border border-border rounded-lg overflow-hidden hover:bg-muted/50 transition-colors">
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              {domain && (
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  {domain}
                </p>
              )}
              {title && (
                <p className="text-sm font-medium leading-snug line-clamp-2">
                  {title}
                </p>
              )}
              {showLinkDescription && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {linkDescription}
                </p>
              )}
              {platforms && platforms.length > 0 && (
                <div className="flex items-center gap-1.5 mt-2">
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

            {ctaText && (
              <span className="px-4 py-1.5 bg-muted hover:bg-muted/80 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                {ctaText}
                <ExternalLink className="w-3 h-3" />
              </span>
            )}
          </div>
        </a>
      </div>
    </div>
  );
}