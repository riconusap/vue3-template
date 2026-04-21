# Copilot Instructions for Vue3 Admin Dashboard

## Goal
Maintain consistent code quality, visual language, and architecture for this Vue 3 admin dashboard.

## Tech and Architecture
- Use Vue 3 SFC with TypeScript.
- Keep page-level layout in `src/layouts` and route screens in `src/views`.
- Keep reusable shell/UI pieces in `src/components`.
- Keep app/session state in Pinia stores under `src/stores`.
- Keep API and HTTP concerns in `src/services`.
- Do not move logic across layers unless explicitly requested.

## UI Libraries
- Primary UI library is Element Plus.
- Bootstrap is available but should be used only when needed, and must respect existing design tokens.
- Prefer Element Plus components for forms, cards, tables, pagination, layout containers, and feedback.

## Styling Rules
- Reuse global tokens from `src/styles/element-overrides.css`.
- Reuse global base styles from `src/styles/index.css`.
- Never hardcode light-only colors when a token exists.
- Prefer these tokens:
  - `--app-bg`, `--app-surface`, `--app-surface-alt`
  - `--app-border`, `--app-border-soft`
  - `--app-text-main`, `--app-text-muted`
  - `--app-shadow-soft`, `--app-shadow-primary`
  - `--app-color-primary`, `--app-color-secondary`
- For new floating panels/cards/tables, follow existing rounded style:
  - radius around 14px to 18px
  - border using `--app-border`
  - shadow using `--app-shadow-soft`

## Dark Mode Consistency
- Theme is driven by CSS variables and `data-theme` on `:root`.
- Every new UI block must work in both light and dark mode.
- Do not introduce fixed `#ffffff`/`#000000` for surfaces/text unless absolutely required.
- If a component needs dark-mode-specific polish, use scoped selectors that depend on `:root[data-theme='dark']`.

## Typography
- Body text uses Inter.
- Headings use Plus Jakarta Sans with bold hierarchy.
- Numeric/time emphasis uses JetBrains Mono via utility classes like `is-number`.
- Keep typography compact and dashboard-friendly.

## Layout Behavior
- Preserve sticky sidebar and sticky header behavior in default layout.
- Keep footer at the bottom of viewport and let main content be the scrollable area.
- On mobile, preserve drawer sidebar behavior and responsive spacing patterns already used.

## Vue and TypeScript Conventions
- Use Composition API (`setup`) with explicit typing for interfaces, refs, and computed values.
- Keep derived UI values in `computed`.
- Keep side effects in lifecycle hooks and watchers.
- Avoid `any`; prefer clear interfaces and narrow types.
- Keep components focused; avoid large mixed-responsibility files.

## Forms and Validation
- Use Element Plus form validation patterns already used in auth pages.
- Show clear error states and keep validation messages concise.
- For password rules/strength UI, follow existing Sign Up behavior and visual language.

## Editing Discipline
- Prefer minimal, targeted edits.
- Do not refactor unrelated files when implementing a small request.
- Preserve existing naming style and folder structure.
- Avoid introducing new dependencies unless necessary.

## Verification Checklist
Before finalizing a change:
- Build/lint/type state is not worsened by your edits.
- No new hardcoded colors bypassing theme tokens.
- Light and dark mode both remain readable.
- Responsive behavior still works at mobile widths.
- Existing interactions (sidebar toggle, theme toggle, auth flow) still function.

## Preferred Response Behavior for Future Agents
- Explain what was changed and why, briefly and concretely.
- Mention affected files clearly.
- If there is a pre-existing workspace alias warning (`@/...` import resolution), do not treat it as a regression unless your change caused it.
