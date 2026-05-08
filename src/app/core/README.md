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