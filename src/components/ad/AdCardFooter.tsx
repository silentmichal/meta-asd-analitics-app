import { extractDomain } from '@/utils/adUtils';
import { ExternalLink } from 'lucide-react';

interface AdCardFooterProps {
  linkUrl?: string;
  ctaText?: string;
  title?: string;
  linkDescription?: string;
}

export default function AdCardFooter({ linkUrl, ctaText, title, linkDescription }: AdCardFooterProps) {
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