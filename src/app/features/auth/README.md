# Auth Feature

This folder contains the authentication feature UI and feature-specific code.

Use this folder for:
- register page
- login page
- passkey registration UI
- passkey login UI
- email verification notice UI
- verify email result page
- resend verification email UI
- logout-related UI if needed

Do not use this folder for:
- global authentication state
- global HTTP interceptors
- global route guards
- CSRF handling
- application-wide user session logic

Rule:
Auth feature UI belongs here.
Application-wide authentication state and infrastructure belong to `core`.