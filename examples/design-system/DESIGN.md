# Design system — architecture and authoring guide

This document is the canonical reference for both humans and coding agents
working on the shared design system for FAST example apps. It defines the
semantic, role-based naming model, the theme contract, and the rules for
adding or modifying tokens.

If you only need a quickstart, see [`README.md`](./README.md).

## Goals

- Provide a single shared token vocabulary for every app in `examples/*`.
- Stay framework- and runtime-neutral: tokens are plain CSS custom properties
  that work in any stylesheet, template, or shadow root.
- Use **semantic, role-based names** so styles describe intent (`background`,
  `foreground`, `stroke`, `status-danger`, `text-global-body3`) instead of
  color values or component identities.
- Support light, dark, and system-driven themes through a single attribute on
  `<html>`, with no JavaScript runtime owned by this package.

## Non-goals

- This package does not ship a component library.
- This package does not ship a JavaScript or TypeScript theme API. There are
  no helpers to import, no theme objects, and no observable change events.
  Apps that need a runtime toggle implement it themselves with two lines of
  DOM code (see [`README.md`](./README.md)).
- This package is not a Theme Builder, token-authoring tool, or palette
  generator.
- This package is not published to npm outside this monorepo.
- This package is not formally aligned with any external design language. The
  token names are inspired by the MS Semantic Tokens taxonomy (sometimes
  called `smtc`), but values, scale, and coverage are tuned for FAST example
  apps.

## Architecture

```text
tokens.css            ─┐
tokens-light.css       ├─▶ :root CSS custom properties ─▶ var(--fast-*) ─▶ rendered UI
tokens-dark.css       ─┘                ▲
                                        │
                            <html data-theme="..."> attribute (set by the app)
```

The flow is intentionally short:

1. The app imports one of the three stylesheets at startup.
2. The stylesheet registers every shared token on `:root`.
3. Components reference tokens through `var(--fast-...)`.
4. If the app uses `tokens.css`, setting `data-theme` on `<html>` swaps the
   active palette; removing the attribute restores `prefers-color-scheme`
   behavior.

`tokens.css` is the recommended entry. The single-theme variants exist for
apps that want a smaller payload or want to avoid the `prefers-color-scheme`
media query entirely.

## Naming grammar

Every token follows the same kebab-case shape:

```text
token       = "--fast-" category [ "-" subcategory ] [ "-" slot ] [ "-" variant ] [ "-" state ] ;
category    = "text" | "padding" | "gap" | "corner" | "stroke" | "ctrl" |
              "background" | "foreground" | "status" | "shadow" |
              "duration" | "curve" ;
subcategory = "global" | "style" | "content" | "between-content" |
              "width" | "divider" | "ctrl" | "layer" | "web-page" |
              "focus" | "card" | "flyout" | "danger" | "success" | "warning" ;
slot        = lowercase kebab-case named slot (e.g. "primary", "secondary",
              "subtle", "brand", "neutral-primary", "neutral-secondary",
              "hint", "on-brand", "on-outline", "outer", "key", "ambient") ;
variant     = lowercase kebab-case modifier (e.g. "solid", "tint") ;
state       = "rest" | "hover" | "pressed" | "disabled" |
              "selected-rest" | "selected-hover" | "selected-pressed" |
              "selected-disabled" ;
```

Ordering rules:

1. Always start with `--fast-`.
2. Keep segments in `category → subcategory → slot → variant → state` order.
3. Omit any segment that does not apply rather than inserting a placeholder.
4. Use lowercase kebab-case for every segment.
5. State (`rest`, `hover`, `pressed`, `disabled`, optionally prefixed with
   `selected-`) is always the trailing segment when it applies.

This grammar mirrors the structure of the MS Semantic Tokens taxonomy used by
the Kumo / mai-ui design tokens. Tokens are scoped by use-site (e.g.
`ctrl-brand`, `ctrl-on-outline`, `web-page`, `layer`, `card`, `flyout`)
rather than by abstract color role.

## Category catalog

| Category | Purpose |
| --- | --- |
| `text` | Typography ramp (`text-global-*`), font styles (`text-style-*`). |
| `padding` | Inset spacing for content within a container (`padding-content-*`). |
| `gap` | Spacing between sibling elements (`gap-between-content-*`). |
| `corner` | Border radius scale (`corner-{none, small, medium, large, circular}`). |
| `stroke` | Border colors (`stroke-divider-*`, `stroke-ctrl-on-outline-*`) and widths (`stroke-width-*`). |
| `ctrl` | Control-level tokens that don't fit `stroke`/`background`/`foreground`, such as focus rings (`ctrl-focus-outer-*`). |
| `background` | Surface fills: pages (`background-web-page-*`), layers (`background-layer-*`), control fills (`background-ctrl-brand-*`, `background-ctrl-subtle-*`). |
| `foreground` | Text and icon colors, scoped by where they appear (`foreground-ctrl-neutral-*`, `foreground-ctrl-brand-*`, `foreground-ctrl-on-brand-*`, `foreground-ctrl-hint-*`). |
| `status` | Semantic status colors with solid and tinted variants (`status-{danger, success, warning}-{background, foreground}` and the `-tint-{background, foreground, stroke}` siblings). |
| `shadow` | Elevation. Atomic pairs (`shadow-card-rest-key`, `shadow-card-rest-ambient`) plus a composed alias (`shadow-card-rest`). |
| `duration` | Motion durations (`duration-{ultra-fast, faster, fast, normal, gentle, slow, slower, ultra-slow}`). |
| `curve` | Motion curves (`curve-{accelerate, decelerate, easy-ease}-{max, mid, min}`, `curve-easy-ease`, `curve-linear`). |

### Type ramp (text-global-*)

The ramp uses semantic role names. **Lower number = larger** (mai-ui
convention).

| Tier | Font size | Line height | Intended use |
| --- | --- | --- | --- |
| `caption2` | 10 | 14 | Smallest helper text, badges. |
| `caption1` | 12 | 16 | Captions, helper text, dense table data. |
| `body3` | 14 | 20 | Standard UI text, form controls. |
| `body2` | 16 | 22 | Comfortable reading body. |
| `body1` | 18 | 26 | Large body / lead paragraph. |
| `subtitle2` | 18 | 26 | Subsection heading. |
| `subtitle1` | 20 | 26 | Section heading. |
| `title2` | 20 | 26 | Smaller card or panel title. |
| `title1` | 24 | 32 | Page or large card title. |
| `display2` | 28 | 32 | Smaller display heading. |
| `display1` | 38 | 40 | Largest display heading (marketing surfaces). |

Every `--fast-text-global-<tier>-font-size` has a same-tier
`--fast-text-global-<tier>-line-height` partner. Pair them.

### Sizing scale (padding-content-*, gap-between-content-*)

t-shirt sizes with full words and hyphens:

`none`, `xx-small`, `x-small`, `small`, `medium`, `large`, `x-large`,
`xx-large`, `xxx-large` (padding only).

`padding-content-*` is for inset within a container. `gap-between-content-*`
is for distance between sibling elements (margins, CSS `gap`). The two are
separate categories because they semantically describe different intents,
even when the numeric value coincides.

### Corner scale

`none` (0), `small` (2), `medium` (4), `large` (6), `circular` (9999px).

### Stroke widths

`stroke-width-default` (1px), `stroke-width-divider-strong` (1.5px). Focus
rings have their own dedicated token: `ctrl-focus-outer-stroke-width` (2px).

### State catalog

`rest`, `hover`, `pressed`, `disabled`. For selectable controls, the
`selected-` prefix yields `selected-rest`, `selected-hover`,
`selected-pressed`, `selected-disabled`.

The historical web vocabulary of `default`/`active` is **not** used in this
package — `rest` and `pressed` are the mai-ui idioms and are now the
authoritative names here as well.

### Examples

- `--fast-background-layer-primary-solid` — primary card / surface fill.
- `--fast-background-ctrl-brand-rest` — brand button background, rest state.
- `--fast-background-ctrl-brand-hover` — brand button background, hover.
- `--fast-foreground-ctrl-on-brand-rest` — text on top of a brand fill.
- `--fast-foreground-ctrl-neutral-secondary-rest` — secondary / muted body
  text (timestamps, metadata).
- `--fast-foreground-ctrl-hint-default` — placeholder and helper text only.
- `--fast-stroke-divider-subtle` — soft border around a card or surface.
- `--fast-ctrl-focus-outer-stroke` / `--fast-ctrl-focus-outer-stroke-width` —
  keyboard focus ring color and width.
- `--fast-status-danger-tint-foreground` — destructive button text color
  (subtle, no solid fill).
- `--fast-status-danger-tint-background` — destructive button hover fill.
- `--fast-text-global-body3-font-size` — paired with
  `--fast-text-global-body3-line-height`.
- `--fast-padding-content-medium` — 16-pixel inset.
- `--fast-gap-between-content-x-small` — 8-pixel gap between siblings.
- `--fast-corner-large` — 6-pixel border radius.
- `--fast-shadow-card-rest` — composed card elevation (key + ambient layers).
- `--fast-duration-fast` paired with `--fast-curve-easy-ease`.

## Theme model

`tokens.css` ships three layers of values:

```css
:root {
    /* theme-independent tokens (typography, padding, gap, corner, motion) */
}

:root,
:root[data-theme="light"] {
    /* light color and shadow values */
}

:root[data-theme="dark"] {
    /* dark color and shadow values */
}

@media (prefers-color-scheme: dark) {
    :root:not([data-theme]) {
        /* dark color and shadow values when no explicit theme is set */
    }
}
```

This produces three states:

| `<html>` attribute | Active palette |
| --- | --- |
| `data-theme="light"` | Light, always. |
| `data-theme="dark"` | Dark, always. |
| _no attribute_ | Light by default; switches to dark while `prefers-color-scheme: dark` matches. |

An attribute (rather than a class) is used because it is an explicit, single
state container that is easy to inspect in dev tools, easy to set during SSR
or hydration, and easy to assert in tests.

`tokens-light.css` and `tokens-dark.css` define every token unconditionally
on `:root` and additionally set `color-scheme: light` or `color-scheme: dark`.
They are the right choice when an app deliberately renders only one mode.

## Light vs dark color mapping

The token name stays semantic across themes; only the value changes.

| Token | Light theme | Dark theme |
| --- | --- | --- |
| `--fast-background-web-page-primary` | Near-white page surface | Near-black page surface |
| `--fast-background-layer-primary-solid` | White card / panel | Dark gray card / panel |
| `--fast-foreground-ctrl-neutral-primary-rest` | Near-black body text | Near-white body text |
| `--fast-background-ctrl-brand-rest` | Brand blue | Brand blue, tuned for dark contrast |
| `--fast-status-danger-tint-foreground` | Danger text on light surface | Danger text on dark surface |
| `--fast-stroke-divider-subtle` | Soft light divider | Soft dark divider |

## Status: solid vs tinted

Status colors come in two flavors:

- **Solid** (`status-danger-background`, `status-danger-foreground`) — a
  filled background with high-contrast text. Use for solid status pills,
  toast bars, error chips.
- **Tinted** (`status-danger-tint-background`, `status-danger-tint-foreground`,
  `status-danger-tint-stroke`) — a low-saturation background with the status
  color used for the text/icon. Use for destructive buttons, inline form
  errors, info banners, and other subtle status surfaces.

A destructive text button uses the tint pair: red text at rest
(`status-danger-tint-foreground`), a soft red background on hover
(`status-danger-tint-background`), and a red outline on focus
(`status-danger-tint-stroke`).

## Authoring guidelines (for humans and agents)

When working on tokens in this package, follow these rules.

### Choose tokens by intent, not value

- Pick the token whose **use-site** matches the styled element. A card
  surface is `--fast-background-layer-primary-solid`. A muted helper text is
  `--fast-foreground-ctrl-neutral-secondary-rest`. A subtle row divider is
  `--fast-stroke-divider-subtle`.
- Do not pick a token because its current value happens to match a desired
  hex code. The value will change between themes; the name will not.
- Reserve `--fast-foreground-ctrl-hint-default` for **placeholder and helper
  text only**. For secondary body text (timestamps, captions, metadata) use
  `--fast-foreground-ctrl-neutral-secondary-rest`.

### Add a token or reuse an existing one?

```text
Need a value?
├─ Can an existing token express the same intent? → Reuse it.
├─ Is the value only local to one component?
│       → Define a local custom property inside that component's css`...`
│         block, backed by a --fast-* token. Do not add it to the package.
├─ Will multiple example apps or shared patterns reuse it?
│       → Add a token, following the naming grammar.
└─ Does it describe a brand-new design domain (e.g. blur, opacity scale)?
        → Coordinate with maintainers before adding a category.
```

### When adding a token

1. Stay inside an existing category whenever possible.
2. Match the grammar: `--fast-<category>-<subcategory>-<slot>[-<variant>][-<state>]`.
3. Keep names semantic. Avoid product-, component-, or palette-specific
   suffixes such as `button-primary-blue`.
4. For colors and shadows, add **both light and dark** values (in
   `tokens.css`, `tokens-light.css`, and `tokens-dark.css`).
5. Keep scales monotonic: t-shirt sizes go from smallest to largest,
   durations from fastest to slowest, shadows from lowest to highest
   elevation.
6. Update the category catalog in this document if the new token introduces
   a new subcategory or slot.
7. Update the catalog table in [`README.md`](./README.md).

### When **not** to add a token

- The value is only meaningful inside one component. Keep it local.
- The value is a one-off marketing color. Use a literal value inside that
  component only and document the choice in a comment.
- A near-equivalent token already exists. Reuse and adjust the existing token
  rather than introducing a synonym.

### Naming review checklist

- Does the name match the
  `--fast-<category>-<subcategory>-<slot>[-<variant>][-<state>]` grammar?
- Is every segment lowercase kebab-case?
- Is the use-site semantic (not product- or component-specific)?
- For interactive variants, is the state segment (`rest`, `hover`, `pressed`,
  `disabled`) last?
- Are paired font-size and line-height values both added?
- For colors and shadows, are both light and dark values defined in all three
  stylesheets?
- Would another example-app developer understand the token from its name
  alone, without extra docs?

## Authoring guidelines for coding agents

These constraints exist so automated edits stay coherent with the design
language. When making changes to any file in `examples/`:

- **Never hard-code colors, font sizes, spacing, radii, border widths, or
  shadows in component CSS.** Use a `var(--fast-...)` token.
- **Never invent ad-hoc tokens** at `:root` inside an example app. Either add
  the token to this package or scope a local custom property to the
  component's host or shadow root.
- **Do not import any JavaScript or TypeScript** from
  `@microsoft/fast-examples-design-system`. The package exports CSS only.
- **Do not introduce a new theme name** (such as a "high-contrast" theme)
  without first adding the corresponding selector and token block to this
  package and updating this document.
- **Theme switching is two lines of DOM code**:
  `document.documentElement.setAttribute("data-theme", "light")` or
  `removeAttribute("data-theme")` for system preference. Implement it inline
  in the consuming app; do not factor it into a shared helper here.
- **When refactoring an app to use this design system**, prefer tokens that
  match the original intent rather than tokens that match the original value.
  For example, an existing `#666` foreground used for helper text should
  become `--fast-foreground-ctrl-neutral-secondary-rest`, not
  `--fast-foreground-ctrl-hint-default` (which is reserved for placeholders).

## Anti-patterns

- Importing JavaScript from this package. _There is none — the previous
  iteration exported helpers; the current iteration intentionally does not._
- Hard-coding colors, font sizes, spacing, radii, border widths, or shadows
  in component styles.
- Introducing app-specific tokens at `:root` from inside an example app.
- Adding aliases or synonyms for tokens that already exist.
- Naming tokens after products or components (e.g. `--fast-todo-row-bg`).
- Using class names instead of the `data-theme` attribute for theme
  switching.
- Using the historical state vocabulary (`default`, `active`,
  `default-hover`) — the current package uses `rest`, `hover`, `pressed`,
  `disabled`.

## Reference

- [`README.md`](./README.md) — quickstart and token catalog
- [`../README.md`](../README.md) — overview of the `examples/` workspace
- [`../DESIGN.md`](../DESIGN.md) — workspace-level design guidance
