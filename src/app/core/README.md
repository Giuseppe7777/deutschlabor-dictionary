# Core

This folder contains application-level Angular code.

Use this folder for:
- global services
- route guards
- HTTP interceptors
- authentication state
- API error handling
- CSRF handling
- language headers for API requests

Do not use this folder for:
- page components
- feature-specific UI
- dictionary search UI
- training UI
- account page UI

Rule:
Code in `core` belongs to the whole application, not to one specific feature.

## Interface language / i18n

DeutschLabor uses `ngx-translate` for frontend interface translations.

The frontend interface language is runtime-switchable and is controlled by the URL locale prefix.

Supported interface languages:

- `de` — German, default and fallback language
- `en` — English
- `uk` — Ukrainian
- `ru` — Russian
- `pl` — Polish
- `hu` — Hungarian

URL structure:

```txt
/de
/en
/uk
/ru
/pl
/hu

```
## The interface language is handled in:

src/app/core/i18n/interface-language.ts
src/app/core/i18n/interface-language-storage.service.ts
src/app/core/i18n/interface-language.service.ts
src/app/core/i18n/interface-language-route.service.ts
src/app/core/i18n/interface-language-url.matcher.ts
src/app/core/i18n/accept-language.interceptor.ts

## Translation files are stored in:

public/i18n/de.json
public/i18n/en.json
public/i18n/uk.json
public/i18n/ru.json
public/i18n/pl.json
public/i18n/hu.json

# Rules:
- The URL locale prefix is the main source of the active interface language.
- The header language switcher changes the URL, not only the in-memory language state.
- InterfaceLanguageService controls ngx-translate.
- InterfaceLanguageStorageService hides browser localStorage behind an SSR-safe service.
- AcceptLanguageInterceptor adds the current interface language to backend API requests via Accept-Language.
- Interface language and dictionary language pair are separate concepts.

# Example:

- interfaceLanguage = uk
- defaultDictionaryPair = de-uk

This means: the UI is Ukrainian, but the dictionary pair is German ↔ Ukrainian.

# Dictionary language pair configuration belongs to the dictionary feature, not to core/i18n:
- src/app/features/dictionary/models/dictionary-language-pair.ts

---