---
name: antigravity-design-system
description: >
  You are a senior frontend engineer and design-systems expert for the
  Antigravity. Your output must be production-grade,
  pixel-perfect, and fully consistent, responsive for all device screens with this design system on every single response — no exceptions, no shortcuts.

  TRIGGER: Apply this skill whenever you are building, editing, reviewing, or
  even glancing at any UI component, page, layout, or style file in this
  workspace.

---

# Antigravity Design System

# Project structure

- Maintain a clear and organized project structure
- Use meaningful names for files and directories
- Avoid clutter by removing unnecessary files

# DRY (Don’t Repeat Yourself)
Each piece of logic should have a single source of truth. Eliminate duplication via reuse (functions, classes).

# Curly’s Law (Do One Thing)
Each unit (function/class/variable) must have one clear responsibility and consistent meaning.

# Premature Optimization
Ignore non-critical optimizations early. Optimize only when necessary and measurable.

## 1. Border Radius

Use only these Tailwind values — no arbitrary radii:

| Token | Use case |
|---|---|
| `rounded-md` | Inputs, badges, small chips |
| `rounded-lg` | Cards, buttons, dropdowns |
| `rounded-xl` | Modals, panels, larger containers |

**Do not** use `rounded-full` except for avatar/icon circles.  
**Do not** use arbitrary values like `rounded-[12px]`.

---

## 2. Layout Structure

- All child/page content must be **full-width** — never add inner `max-w-*` wrappers directly in page components.
- If a centred reading column is explicitly required by the design, use the **reusable `ContainerWrapper` component** (`@/components/reuseable/ContainerWrapper`) — do not write a one-off `max-w-*` div. It accepts a `className` prop for per-use overrides (e.g. `<ContainerWrapper className="py-8">`).
- Remove redundant container padding; let the layout shell (`main` in `DashboardShell`) own the page padding.
- Standard page padding: `p-4 lg:p-8` (already set in `DashboardShell`).
- Never add a second wrapper `div` with padding inside a page component.

---

## 3. Header / Page Title

- **All page titles live in a reusable page header/title component** with optional action buttons — not inside the page body.
- A page component must never render its own `<h1>` title that duplicates what the TopBar shows.
- The TopBar accepts a `title` prop (or reads from the route) — use that pattern.

---

## 4. Color Tokens

**Always derive design tokens dynamically from the project's CSS token file.** Do not hardcode hex or rgb values.

### How to find the tokens
1. Locate `globals.css` (or `index.css` / `global.css`) in `app/`, `src/`, or the project root.
2. Read the `@theme inline { … }` block (Tailwind v4) or the `:root { … }` custom-property block.
3. Map each `--color-*` variable to its Tailwind utility class (e.g. `--color-brand-card` → `bg-brand-card`).
4. Use **only** those semantic utility classes in JSX/TSX — never paste the raw hex value.

### Example (from this project's globals.css — may differ in other projects)

| Variable | Semantic Class | Usage |
|---|---|---|
| `--color-brand-page` | `bg-brand-page` | Layout main background |
| `--color-brand-card` | `bg-brand-card` | Cards, sidebars, panels |
| `--color-brand-input` | `bg-brand-input` | Text inputs, textareas, selects |
| `--color-brand-border` | `border-brand-border` | All card, input, panel borders |
| `--color-brand-btn` | `bg-brand-btn` | Primary action buttons |
| `--color-brand-btn-hover` | `hover:bg-brand-btn-hover` | Primary button hover state |

> **Note:** Always re-read the CSS file when starting work in a new project or when the token list may have changed. Never assume token names from memory.

---

## 5. Input Fields

All `<input>`, `<textarea>`, `<select>` elements must follow:

```
bg-brand-input border border-brand-border rounded-lg
px-4 py-2.5 text-sm text-white
outline-none
focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500
```

- Height: implicitly set by `py-2.5` + `text-sm` — do NOT set `h-*` manually on inputs. Always add `cursor-pointer` to inputs.
- Placeholder: `placeholder:text-white/30`.
- Error state: add `border-red-500` conditionally.

---

## 6. Buttons
```
cursor-pointer

```
### Primary Button
```
bg-brand-btn hover:bg-brand-btn-hover text-white
rounded-lg px-6 h-10 text-sm font-semibold
shadow-lg shadow-brand-btn/20 transition-colors duration-200 
```

### Secondary / Ghost Button
```
bg-white/5 border border-brand-border hover:border-white/30
text-white/70 hover:text-white
rounded-lg px-6 h-10 text-sm font-medium transition-colors duration-200 
```

### Disabled (all variants)
```
opacity-50 cursor-not-allowed pointer-events-none
```

- All buttons use fixed height `h-10` (40px). Never use `py-*` to control button height.
- Icon-only buttons: `h-10 w-10 flex items-center justify-center`.

---

## 7. Typography Scale

Tailwind text utilities only. No `px` sizes, no inline `style={{ fontSize }}`:

| Class | Usage |
|---|---|
| `text-3xl font-semibold` | Page-level headings (TopBar title) |
| `text-2xl font-semibold` | Section headings, card titles |
| `text-xl font-medium` | Sub-section headings |
| `text-base` | Regular body / paragraph text |
| `text-sm` | Card body text, labels, inputs, nav items |
| `text-xs` | **Lowest allowed size** — regular UI content only |
| `text-[10px]` | **Exception only**: unread badge counters (e.g., `99+`) |

### Strict Typography Rules:
- **`text-xs` is the absolute lowest text size** permitted for regular UI content, card text, form labels, and descriptions.
- Paragraph text default is `text-base` or `text-sm`.
- Paragraph text on cards must be `text-sm`. Card title should be `text-xl`.
- Do NOT use `text-[10px]` for general body text or card descriptions. Only badge counters (e.g. `99+`) can use `text-xs`.

---

## 8. Spacing Rules

- Use Tailwind spacing scale only (`p-4`, `gap-4`, `space-y-4`, etc.)
- No pixel values in className strings or inline styles for spacing.
- Prefer `gap-*` over `space-x-*` / `space-y-*` when using flex/grid.

---

## 9. Sidebar & Navigation

- Sidebar width: `w-76`. Layout content offset: `lg:ml-76`.
- Nav list spacing: `space-y-2`.
- Nav item height: `h-11` with `flex items-center`.
- Active state: `bg-linear-to-r from-brand-card/50 to-brand-border/30 text-white` (verify exact gradient tokens in globals.css)
- Hover state: `hover:bg-white/5 hover:text-white`
- Layout shell: `DashboardShell.tsx` manages all sidebar rendering + offsets + roles.

---

## 10. Loading States — Skeletons Only

- **NEVER use generic full-screen or section spinners** (`<Loader2 className="animate-spin" />` or `Spinner`) for page or component data fetching.
- **ALWAYS use Skeleton loaders** (`animate-pulse` placeholder cards/rows/inputs) that match the exact shape, layout, and size of the expected content.
- Button submittal states (e.g. "Saving...") are the **only exception** where a small inline `Loader2` icon inside the button is allowed.

---

## 11. Custom Reusable Confirmation & Permission Modals

- **NEVER use browser native `alert()`, `confirm()`, or un-styled third-party popups (`sweetalert`, `swal`)** for action confirmations, deletions, or permission prompts.
- **ALWAYS use the custom reusable `ConfirmModal` component** (`@/components/reuseable/ConfirmModal`).
- The modal must adhere strictly to design system tokens (`bg-brand-card`, `border-brand-border`, dark backdrop `bg-black/75 backdrop-blur-xs`).
- Supports 4 variants: `danger` (red destructive actions), `warning` (amber caution), `info` (cyan information), `success` (green success).

---

## 12. Dropdowns & Selects — Use Popover Window Controls

- **ALWAYS use a custom Popover window / panel for complex filters and dropdown selections** instead of basic native browser `<select>` tags whenever rich filtering, category selections, or multi-field filters are needed.
- The popover panel must use design system tokens (`bg-brand-card`, `border-brand-border`, `rounded-xl`, `shadow-2xl`, `z-50`).
- Provide clear labels, active filter indicators, clear filter actions (`RotateCcw`), and smooth transition animations (`animate-in fade-in`).

---

## 13. Strict Constraints — NEVER Do These

- Use `px` values for spacing, sizing, or font sizes.
- Use generic spinners (`<Loader2 animate-spin>`) for content loading — use Skeletons instead.
- Use `text-xs` (12px) for card content or form text — `text-sm` (14px) is the minimum.
- Use native `alert()` / `confirm()` or standard `sweetalert` (`swal`) — use `ConfirmModal` instead.
- Use raw hex/rgb values — always use the semantic classes derived from the project's CSS token file.
- Duplicate JSX structure that already exists in `DashboardShell`.
- Add a page `<h1>` title inside a page when the TopBar already shows it.
- Use `rounded-full` on non-circular elements.
- Use `overrideExisting: false` in RTK Query `injectEndpoints` when endpoint names collide — rename the endpoint instead.

---

## 14. RTK Query Conventions

- Endpoint names must be **globally unique** across all `injectEndpoints` calls on `baseApi`.
- Prefix role-specific endpoints: `updateScoutProfile`, `updatePlayerProfile`, `updateClubProfile`.
- Never use a generic name like `updateProfile` unless it is the only profile endpoint in the entire app.

---

## 15. Refined UI/UX Style Rules (Update)

- **Color Tokens**:
  - Main background or layout background: `#F6F9FF` (CSS variable `--layout-bg`).
  - Sidebar background: `#FFFFFF` (white).
  - Inactive text/icon color: `#8188A2` (CSS variable `--muted-blue`).
- **Dashboard Layout heights & positioning**:
  - Dashboard Header height: `h-20` (80px) for both the header and the sidebar logo container.
  - Floating Collapse Button alignment: Position exactly `top-20` (80px) from the top (aligned exactly on the header bottom border line intersection).
  - Page Titles: Do NOT render page titles inside the main page body. Page titles and descriptions must be rendered inside the `Header` component. Font weight for titles must be `semibold` (e.g. `font-semibold`), not `bold` or `black`.
  - Layout Viewport Lock: Parent layout must enforce `h-screen overflow-hidden`. The Topbar and Sidebar must remain fixed, and only the main body `<main className="overflow-y-auto">` scrolls.
- **Shadows & Borders Constraint**:
  - Do NOT use shadows if you are using borders, and do NOT use borders if you are using shadows. (e.g., headers, profile cards, and dropdown triggers must not have shadows if they have borders).
- **Forms & Inputs styling**:
  - Form Inputs, Textareas, Select fields, and Datepicker triggers must use the layout background `#F6F9FF` (`bg-layout-bg`) instead of white or standard gray.
  - Dropdown & Calendar width matching: The calendar popover/select dropdown width must match the trigger field width exactly (e.g. using `w-full` and limiting popover width to trigger width, and using Base UI's dynamic `--anchor-width` positioning properties).
- **Custom Scrollbar design**:
  - Target all scrollable containers using custom scrollbar styling in `globals.css` / `index.css`.
  - Use primary color `#2F65C8` at 40% opacity in normal state, rising to 80% opacity on hover.
- **Breadcrumbs typography & colors**:
  - Do not use bold/extrabold weights on breadcrumb paths. Active segment must use primary color `#2F65C8`, and inactive segments/separators/home icon must use `text-muted-blue` (`#8188A2`).
- **Notifications & Profile dropdowns**:
  - Notifications popover mobile alignment: must use `fixed md:absolute left-4 right-4 md:left-auto md:right-0 mt-2 top-20 md:top-auto w-auto md:w-80` to prevent mobile clipping.
  - User profile dropdown trigger button: must use Unsplash user portrait photo (`https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80`) and hide all chevrons/text (a clean `w-10 h-10 rounded-xl` image button with hover ring).
  - Profile dropdown list layout: must render a header with user avatar/name/email, links with colorful background icon containers (Dashboard, My Profile, Settings, Activity Log), and a separated footer logout button.
  - Dropdown absolute positioning: must use `top-full mt-2` to align exactly below the trigger button and prevent clipping.
- **Sidebar items and active trail**:
  - Root category items must use `font-semibold` by default. Nested children links must use `font-medium`.
  - Nested active trail: highlight parent and grandparent routes active with gradient background when a deep nested sub-route is active. Use dynamic indentation based on depth.

