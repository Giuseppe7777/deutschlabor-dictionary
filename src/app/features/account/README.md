# Account Feature

This folder contains the user account area.

Use this folder for:
- account overview page
- profile page
- language settings UI
- default dictionary pair settings UI
- email verification status UI
- passkey management UI
- session/device management UI
- recovery flow UI

Do not use this folder for:
- global authentication state
- global HTTP interceptors
- global route guards
- dictionary search logic
- training logic

Rule:
Account feature UI belongs here.
Application-wide user/session state belongs to `core`.