# Features

This folder contains the main product features of the DeutschLabor Dictionary application.

Use this folder for:
- authentication feature
- account feature
- dictionary feature
- training feature
- feature-specific pages
- feature-specific components
- feature-specific services

Do not use this folder for:
- global application services
- global HTTP interceptors
- global route guards
- reusable shared UI components
- layout shell components

Rule:
Each feature should contain code that belongs to one product area.
Shared code goes to `shared`.
Application-wide code goes to `core`.
Stable layout code goes to `layout`.