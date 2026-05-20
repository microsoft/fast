# Design system — architecture and authoring guide

This document is the canonical reference for both humans and coding agents
working on the shared design system for FAST example apps. It defines the
semantic, role-based naming model, the theme contract, and the rules for
adding or modifying tokens.

If you only need a quickstart, see [`README.md`](./README.md).

## Goals

- Provide a single Fluent 2-aligned token vocabulary for every app in
  `examples/*`.
- Stay framework- and runtime-neutral: tokens are plain CSS custom properties
  that work in any stylesheet, template, or shadow root.
- Use **semantic, role-based names** so styles describe intent (`background`,
  `accent`, `divider`, `body-1`, `danger-foreground`) instead of color values
  or component identities.
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
token     = "--fast-" category [ "-" role ] [ "-" variant ] [ "-" state ] ;
category  = "color" | "font-family" | "font-size" | "line-height" |
            "font-weight" | "spacing" | "radius" | "border-width" |
            "shadow" | "duration" | "easing" ;
role      = lowercase kebab-case semantic role (see role catalog below) ;
variant   = lowercase kebab-case scale step or named variant ;
state     = lowercase kebab-case interaction state ;
```

Ordering rules:

1. Always start with `--fast-`.
2. Keep segments in `category → role → variant → state` order.
3. Omit any segment that does not apply rather than inserting a placeholder.
4. Use lowercase kebab-case for every segment.
5. Always put interaction state (`hover`, `active`, `selected`, `disabled`,
   `focus`) **last**.

### Role catalog (color category)

| Role | Meaning | Example |
| --- | --- | --- |
| `background` | Surface fills behind content | `--fast-color-background-default` |
| `foreground` | Text and iconography color on a background | `--fast-color-foreground-default` |
| `border` | Stroke around a surface or control | `--fast-color-border-subtle` |
| `accent` | Brand color and its derived states | `--fast-color-accent-default` |
| `feedback` | Status communication (`danger`, `success`, `warning`) | `--fast-color-feedback-success-foreground` |

### Variant catalog

| Use | Variants |
| --- | --- |
| Background fills | `default`, `canvas`, `subtle`, `muted`, `emphasis-subtle`, `emphasis`, `inverse`, `disabled` |
| Foreground text | `default`, `muted`, `subtle`, `faint`, `inverse`, `on-accent`, `disabled` |
| Borders | `default`, `subtle`, `strong`, `divider`, `disabled` |
| Accent | `default`, `foreground`, `link`, `border` |
| Feedback | `danger-foreground`, `danger-background`, `success-foreground`, `success-background`, `warning-foreground`, `warning-background` |
| Spacing, radius, border-width | t-shirt sizing: `none`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, plus `pill` for radius |
| Shadow | `xs`, `sm`, `md`, `lg`, `xl`, `2xl` |
| Type ramp | `caption-2`, `caption-1`, `body-1`, `body-2`, `subtitle-2`, `subtitle-1`, `title-3`, `title-2`, `title-1`, `display` |
| Font weight | `regular`, `medium`, `semibold`, `bold` |
| Duration | `instant`, `fastest`, `fast`, `normal`, `slow`, `slowest`, `extra-slow` |
| Easing | `standard`, `emphasized`, `accelerate[-subtle | -strong]`, `decelerate[-subtle | -strong]`, `linear` |

### State catalog

`hover`, `active`, `selected`, `disabled`, `focus`.

State is always the trailing segment, applied to the variant it modifies:
`--fast-color-background-default-hover`, `--fast-color-accent-default-active`,
`--fast-color-border-default-hover`.

### Examples

- `--fast-color-background-default` — primary surface fill.
- `--fast-color-background-default-hover` — primary surface fill, hover state.
- `--fast-color-foreground-on-accent` — text on top of an accent fill.
- `--fast-color-accent-link-hover` — hover state for an accent-styled link.
- `--fast-color-feedback-danger-background` — danger surface fill.
- `--fast-font-size-body-1` — paired with `--fast-line-height-body-1`.
- `--fast-spacing-md` — twelve-pixel spacing step.
- `--fast-radius-lg`, `--fast-border-width-sm`, `--fast-shadow-md`,
  `--fast-duration-fast`, `--fast-easing-standard`.

## Theme model

`tokens.css` ships three layers of values:

```css
:root {
    /* theme-independent tokens (typography, spacing, radius, motion) */
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

## Type ramp rationale

The type ramp uses semantic role names (`caption-2`, `caption-1`, `body-1`,
`body-2`, `subtitle-2`, `subtitle-1`, `title-3`, `title-2`, `title-1`,
`display`) rather than numeric scales. The intent is for the token name to
describe how the type is used, not where it sits on a 100–1000 axis:

| Token | Intended use |
| --- | --- |
| `caption-2`, `caption-1` | Helper text, timestamps, captions, dense table data. |
| `body-1`, `body-2` | Standard UI text, form controls, descriptions. |
| `subtitle-2`, `subtitle-1` | Section headings inside a page or card. |
| `title-3`, `title-2`, `title-1` | Page titles and large headings. |
| `display` | Marketing or splash surfaces only. |

Every `--fast-font-size-*` token has a same-named `--fast-line-height-*`
partner. Pair them in styles so vertical rhythm stays consistent.

## Light vs dark color mapping

The token name stays semantic across themes; only the value changes.

| Token | Light theme | Dark theme |
| --- | --- | --- |
| `--fast-color-background-default` | Near-white primary surface | Near-black primary surface |
| `--fast-color-foreground-default` | Near-black default text | Near-white default text |
| `--fast-color-accent-default` | Fluent brand blue | Fluent brand blue, tuned for dark contrast |
| `--fast-color-feedback-danger-foreground` | Danger foreground tuned for light surfaces | Danger foreground tuned for dark surfaces |
| `--fast-color-border-divider` | Subtle light divider | Subtle dark divider |

## Authoring guidelines (for humans and agents)

When working on tokens in this package, follow these rules.

### Choose tokens by intent, not value

- Pick the token whose **role** matches the styled element. A card surface is
  `--fast-color-background-default`. A muted helper text is
  `--fast-color-foreground-subtle`. A subtle row divider is
  `--fast-color-border-divider`.
- Do not pick a token because its current value happens to match a desired
  hex code. The value will change between themes; the role will not.

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
2. Match the grammar: `--fast-<category>-<role>[-<variant>][-<state>]`.
3. Keep names semantic. Avoid product-, component-, or palette-specific
   suffixes such as `button-primary-blue`.
4. For colors and shadows, add **both light and dark** values (in `tokens.css`,
   `tokens-light.css`, and `tokens-dark.css`).
5. Keep scales monotonic: t-shirt sizes go from smallest to largest, durations
   from fastest to slowest, shadows from lowest to highest elevation.
6. Update the role / variant tables in this document if the new token
   introduces a new role, variant, or category.
7. Update the catalog table in [`README.md`](./README.md).

### When **not** to add a token

- The value is only meaningful inside one component. Keep it local.
- The value is a one-off marketing color. Use a literal value inside that
  component only and document the choice in a comment.
- A near-equivalent token already exists. Reuse and adjust the existing token
  rather than introducing a synonym.

### Naming review checklist

- Does the name match the `--fast-<category>-<role>[-<variant>][-<state>]`
  grammar?
- Is every segment lowercase kebab-case?
- Is the role semantic (not product- or component-specific)?
- For interactive variants, is the state segment (`hover`, `active`,
  `selected`, `disabled`, `focus`) last?
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
  become `--fast-color-foreground-subtle`, not `--fast-color-foreground-faint`
  just because the literal value is closer.

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

## Reference

- [Fluent 2 design tokens](https://fluent2.microsoft.design/design-tokens/)
- [Fluent 2 color guidance](https://fluent2.microsoft.design/color/)
- [`README.md`](./README.md) — quickstart and token catalog
- [`../README.md`](../README.md) — overview of the `examples/` workspace
- [`../DESIGN.md`](../DESIGN.md) — workspace-level design guidance
