import { UrlMatcher, UrlSegment } from '@angular/router';

import { isSupportedInterfaceLanguage } from './interface-language';

export const interfaceLanguageUrlMatcher: UrlMatcher = (
  segments: UrlSegment[],
) => {
  if (segments.length === 0) {
    return null;
  }

  const possibleLanguage = segments[0].path;

  if (!isSupportedInterfaceLanguage(possibleLanguage)) {
    return null;
  }

  return {
    consumed: [segments[0]],
    posParams: {
      language: segments[0],
    },
  };
};