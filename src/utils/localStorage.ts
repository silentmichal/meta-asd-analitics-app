import { StoredAnalysis } from '@/types/ad.types';

const STORAGE_KEY = 'currentAnalysis';
const LAST_PAGE_ID_KEY = 'lastPageId';

export function saveAnalysis(analysis: StoredAnalysis): void {
  try {
    // Debug logging when saving
    console.log('Saving to localStorage:', {
      adsCount: analysis.ads?.length,
      firstAdHasBasic: analysis.ads?.[0]?.basic ? 'yes' : 'no',
      basicStructure: analysis.ads?.[0]?.basic
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(analysis));
  } catch (error) {
    console.error('Failed to save analysis to localStorage:', error);
  }
}

export function loadAnalysis(): StoredAnalysis | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Debug logging when loading
      console.log('Loading from localStorage:', {
        adsCount: parsed.ads?.length,
        firstAdHasBasic: parsed.ads?.[0]?.basic ? 'yes' : 'no', 
        basicStructure: parsed.ads?.[0]?.basic
      });
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('Failed to load analysis from localStorage:', error);
    return null;
  }
}

export function clearAnalysis(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear analysis from localStorage:', error);
  }
}

export function saveLastPageId(pageId: string): void {
  try {
    localStorage.setItem(LAST_PAGE_ID_KEY, pageId);
  } catch (error) {
    console.error('Failed to save page ID:', error);
  }
}

export function loadLastPageId(): string | null {
  try {
    return localStorage.getItem(LAST_PAGE_ID_KEY);
  } catch (error) {
    console.error('Failed to load page ID:', error);
    return null;
  }
}