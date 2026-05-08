# Shared

This folder contains reusable Angular code used by multiple features.

Use this folder for:
- shared UI components
- reusable form controls
- loading indicators
- error message components
- small reusable pipes
- small reusable helper functions

Do not use this folder for:
- global application state
- authentication state
- HTTP interceptors
- route guards
- feature-specific page components

Rule:
Code in `shared` must be reusable by more than one feature.