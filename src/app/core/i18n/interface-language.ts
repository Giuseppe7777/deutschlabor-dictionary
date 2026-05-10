export const SUPPORTED_INTERFACE_LANGUAGES = [
  'de',
  'en',
  'uk',
  'ru', 
  'pl',
  'hu',
] as const;

export type InterfaceLanguage = (typeof SUPPORTED_INTERFACE_LANGUAGES)[number];

export const DEFAULT_INTERFACE_LANGUAGE: InterfaceLanguage = 'de';

export const INTERFACE_LANGUAGE_STORAGE_KEY = 'deutschlabor.interfaceLanguage'; 

export function isSupportedInterfaceLanguage(
  value: string | null | undefined,
): value is InterfaceLanguage {
  return (
    typeof value === 'string' &&
    (SUPPORTED_INTERFACE_LANGUAGES as readonly string[]).includes(value)
  );
}