# Frontend & UI Conventions

## Tech Stack
- Next.js 16 (App Router) + React 19
- Tailwind CSS v4 + Base UI / Radix primitives
- **shadcn/ui** for UI component library
- **lucide-react** for icons

## shadcn/ui Component Conventions
- All reusable base UI elements live in `@/components/ui/` (e.g. `Button`, `Input`, `Textarea`, `Tabs`, `Dialog`, `Select`, `Card`, `Badge`, `Switch`, `Tooltip`).
- Use `cn()` from `@/lib/utils` for conditional class merging.
- Use shadcn CLI (`npx shadcn@latest add <component>`) or create standard components following the project's `components.json` configuration (`style: base-vega`).
- Compose larger feature components inside `src/components/` by building upon `@/components/ui/*`.

## UI Architecture & Layout
- Modern, high-density social media dashboard layout.
- Split-screen workspace: Multi-platform Composer on the left/main area and Real-time Interactive Post Previews on the right/tabbed panel.
- Dark mode first with clean glassmorphism accents and subtle micro-transitions.

## Component Rules
- Reusable, atomic components in `src/components/`.
- Client components only where user interaction/state is required (`"use client"`).
- Keep components minimal and clean without bloated state wrappers.
