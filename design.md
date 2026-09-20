# Design System — Alrafei CV

## Aesthetic Direction
Dark, minimal, engineering-focused — inspired by Linear & Stripe dashboards.
Confident, quiet, high-contrast. No clutter, no cheap gradients.

## Colors
- Background base: Slate-950 (#020617)
- Surface / cards: Slate-900 (#0f172a) with subtle border Slate-800
- Primary accent: Emerald-500 (#10b981) — replaces the old flat green
- Secondary accent: Indigo-500 (#6366f1) — used sparingly for AI/tech badges
- Text primary: Slate-100
- Text secondary: Slate-400
- Success/verify badges: Emerald-400

## Typography
- Headings: Inter, weight 600-700
- Body: Inter, weight 400
- Arabic text: Tajawal (weight 400/700)
- Numbers/percentages/code: JetBrains Mono

## Spacing & Layout
- Card gap: 24px (gap-6 equivalent)
- Section padding: 64px vertical on mobile, 96px on desktop
- Border radius: 16px on cards (rounded-2xl), 12px on buttons

## Components
- Cards: bg-slate-900, border border-slate-800, subtle shadow, backdrop-blur-md on glass cards
- Buttons: solid emerald-500 for primary, ghost/outline slate-700 for secondary, smooth hover (150ms ease)
- Skill rings: thin stroke (4px), emerald gradient, animated fill on scroll-into-view
- Badges/tags: bg-slate-800, text-slate-300, rounded-full, text-xs

## Motion
- Micro-interactions only — no flashy/gimmicky animation
- Hover: scale(1.02) + border color shift, 150-200ms ease-out
- Scroll-reveal: fade + translateY(20px) → 0, 400ms, staggered by 80ms per card
- Tilt on project/skill cards: max ±6deg, spring-like easing, subtle — not cartoonish

## Icons
- Lucide Icons only (consistent stroke width 2px)

## What to avoid
- No Bootstrap default components/spacing
- No neon glow, no rainbow gradients, no bouncy/elastic animation
- No stock photo placeholders — use icon-based or gradient placeholders instead
