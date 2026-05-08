# Layout

This folder contains application layout components.

Use this folder for:
- header
- navigation
- footer
- language switcher in the main layout
- account menu
- training badge in the navigation
- layout shell components

Do not use this folder for:
- page components
- API services
- authentication state
- dictionary search logic
- training logic

Rule:
Code in `layout` defines the stable visual frame of the application.
Feature pages are rendered inside the layout through Angular routing and `router-outlet`.