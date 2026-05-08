# Routing Architecture

This file describes the planned route structure for the DeutschLabor Dictionary frontend.

## Current rule

Routes are defined in:

`src/app/app.routes.ts`

The root application template contains:

`<router-outlet />`

Angular Router renders page components inside this outlet based on the current URL.

## Planned public routes

- `/`  
  Main dictionary search page.

- `/login`  
  Passkey login page.

- `/register`  
  Passkey registration page.

- `/verify-email`  
  Email verification result page.

## Planned protected routes

- `/account`  
  User account area.

- `/training`  
  Word training area.

## Feature ownership

- Dictionary routes belong to `features/dictionary`.
- Auth routes belong to `features/auth`.
- Account routes belong to `features/account`.
- Training routes belong to `features/training`.

## Important rule

`App` is the root component and must not be used as a routed page component.

Routed pages are inserted into `<router-outlet />`.

The application layout, such as header and navigation, stays outside the routed page components.