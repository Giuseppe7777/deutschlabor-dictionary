export const SUPPORTED_DICTIONARY_LANGUAGE_PAIRS = [
  'de-en',
  'en-de',
  'de-uk',
  'uk-de',
  'de-ru',
  'ru-de',
  'de-pl',
  'pl-de',
  'de-hu',
  'hu-de',
] as const;

export type DictionaryLanguagePair =
  (typeof SUPPORTED_DICTIONARY_LANGUAGE_PAIRS)[number];

export const DEFAULT_DICTIONARY_LANGUAGE_PAIR: DictionaryLanguagePair = 'de-uk';

export const DICTIONARY_LANGUAGE_PAIR_STORAGE_KEY =
  'deutschlabor.defaultDictionaryPair';

export function isSupportedDictionaryLanguagePair(
  value: string | null | undefined,
): value is DictionaryLanguagePair {
  return (
    typeof value === 'string' &&
    (SUPPORTED_DICTIONARY_LANGUAGE_PAIRS as readonly string[]).includes(value)
  );
}