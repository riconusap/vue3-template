# Vue 3 Admin Dashboard Template

A scalable admin dashboard starter built with Vue 3, TypeScript, Element Plus, Pinia, Axios, Font Awesome, and ApexCharts.

## Features

- Auth pages with split-panel layout and flip-card transition
- Responsive default layout with floating rounded sidebar, header, main area, and footer
- Collapsible desktop sidebar and mobile drawer sidebar behavior
- Dashboard area chart with mock data
- User, Menu, and Role management tables with pagination
- Form validation with polished error state and password strength meter
- Axios service with interceptor-ready boilerplate

## Tech Stack

- Vue 3 + TypeScript
- Element Plus
- Pinia
- Vue Router
- Axios
- ApexCharts + vue3-apexcharts
- Font Awesome

## Project Structure

- `src/layouts` - Auth and main application layouts
- `src/components` - Reusable shell components like header and sidebar
- `src/views` - Pages for auth, dashboard, and management modules
- `src/stores` - Pinia stores for app state and auth session
- `src/services` - API client and HTTP utilities
- `src/styles` - Global styles and Element Plus overrides

## Environment

Copy the example environment file and adjust the API base URL when you are ready to connect a backend.

```bash
cp .env.example .env.local
```

Default example variables:

```env
VITE_API_BASE_URL=https://api.example.com/v1
VITE_API_TIMEOUT=10000
VITE_APP_ENV=development
```

## Available Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Notes

- The current UI uses mock data and demo sign-in behavior.
- Sidebar and layout spacing are optimized for desktop and mobile.
- If you integrate a backend later, update `src/services/http.ts` and the auth stores accordingly.
