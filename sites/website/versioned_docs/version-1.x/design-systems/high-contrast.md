---
id: high-contrast
title: High Contrast in FAST
sidebar_label: High Contrast
custom_edit_url: https://github.com/microsoft/fast/edit/main/sites/website/versioned_docs/version-legacy/design-systems/high-contrast.md
description: High contrast mode uses the CSS media feature, forced-colors. When forced-colors is set to active, the user agent will apply a limited color palette to the component.
keywords:
    - forced-colors
    - high contrast themes
---

## Styling components using forced-colors.

High contrast mode uses the CSS media feature, [`forced-colors`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors). When `forced-colors` is set to `active`, the user agent will apply a limited color palette to the component.


**Example:**

```css
@media (forced-colors: active) {
    :host {
        background: ButtonFace;
    }
}
```

FAST has a [forcedColorsStylesheetBehavior](https://github.com/microsoft/fast/tree/archives/fast-foundation-3/packages/web-components/fast-foundation/src/utilities/match-media-stylesheet-behavior.ts) utility function that is used to construct `forced-colors` in a stylesheet. This function is passed to the `withBehavior` function from the `css` tagged template object.

:::note
The reason for this behavior is to avoid the runtime cost of applying `forced-color` style rules when the UA does not match the `forced-colors` @media query. FAST exposes a behavior that conditionally adds and removes stylesheets based on this media query, so forced-colors' stylesheets can then be conditionally applied where necessary.
:::

**Example**

```ts
export const ComponentStyles = css`
    /* ... */
 `.withBehaviors(
    forcedColorsStylesheetBehavior(
        css`
            :host {
                background: ButtonFace;
            }
        `
    )
);
```

## System Color Keyword

In `forced-colors` mode, the colors on the component are reduced to a limited color palette chosen by the user. The [System Color keywords](https://developer.mozilla.org/en-US/docs/web/css/color_value#System_Colors) defined by the CSS Color Module Level 4 specification expose these user-chosen colors.

FAST provides a [`SystemColors`](https://github.com/microsoft/fast/tree/archives/fast-foundation-3/packages/utilities/fast-web-utilities/src/system-colors.ts) enum to use when setting the color value keywords in a `forced-colors` stylesheet.

**Example**
```ts
export const ComponentStyles = css`
    /* ... */
 `.withBehaviors(
    forcedColorsStylesheetBehavior(
        css`
            :host {
                background: ${SystemColors.ButtonFace};
            }
        `
    )
);
```

## Forced colors and Windows High Contrast themes

`forced-colors` works with Windows high contrast mode in Windows, located in Ease of Access within Settings. There are two default themes to test high contrast, `High Contrast Black` and `High Contrast White`.

![High contrast black theme](https://static.fast.design/assets/high-contrast/hc-black.png)
![High contrast white theme](https://static.fast.design/assets/high-contrast/hc-white.png)


Here is a 1:1 map between the `forced-colors` keywords and Windows high contrast resource names.

| forced-colors               | Windows         |
|-----------------------------|-----------------|
| `CanvasText`                | `Text`          |
| `LinkText`                  | `Hyperlinks`    |
| `GrayText`                  | `Disabled Text` |
| `HighlightText` `Highlight` | `Selected Text` |
| `ButtonText` `ButtonFace`   | `Button Text`   |
| `Canvas`                    | `Background`    |

## Quick demo

Here is a simple example of adding high contrast to style an accent button. It has selectors for rest, active, hover, focus, and disabled.

![Accent button](https://static.fast.design/assets/high-contrast/accent.png)

```ts
export const AccentButtonStyles = css`
    :host([appearance="accent"]) {
        background: ${accentFillRest};
        color: ${foregroundOnAccentRest};
    }
    :host([appearance="accent"]:hover) {
        background: ${accentFillHover};
    }
    :host([appearance="accent"]:active) .control:active {
        background: ${accentFillActive};
    }
    :host([appearance="accent"]) .control:${focusVisible} {
        box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) inset ${focusStrokeInner};
    }
    :host([appearance="accent"][disabled]) {
        opacity: ${disabledOpacity};
        background: ${accentFillRest};
    }
`
```

When high contrast is enabled, the system will try to apply the correct color. In the case of this accent button, the system is missing a few things. We do not have a background, `rest` and `hover` states are the same, `focus` is not following the button's `focus` design, and the `disabled` state is too dim.

![Accent button no forced colors](https://static.fast.design/assets/high-contrast/accent-no-forced-colors.png)

To fix this, we will pass a [forcedColorsStylesheetBehavior](https://github.com/microsoft/fast/tree/archives/fast-foundation-3/packages/web-components/fast-foundation/src/utilities/match-media-stylesheet-behavior.ts) object to `withBehaviors`, using similar selectors, and setting property values with the `SystemColors` keyword.

```ts
export const AccentButtonStyles = css`
    /* ... */
`.withBehaviors(
    forcedColorsStylesheetBehavior(
        css`
            :host([appearance="accent"]) .control {
                forced-color-adjust: none;
                background: ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
            }
            :host([appearance="accent"]) .control:hover,
            :host([appearance="accent"]:active) .control:active {
                background: ${SystemColors.HighlightText};
                border-color: ${SystemColors.Highlight};
                color: ${SystemColors.Highlight};
            }
            :host([appearance="accent"]) .control:${focusVisible} {
                border-color: ${SystemColors.ButtonText};
                box-shadow: 0 0 0 2px ${SystemColors.HighlightText} inset;
            }
            :host([appearance="accent"][disabled]),
            :host([appearance="accent"][disabled]) .control,
            :host([appearance="accent"][disabled]) .control:hover {
                background: ${SystemColors.ButtonFace};
                border-color: ${SystemColors.GrayText};
                color: ${SystemColors.GrayText};
                opacity: 1;
            }
        `
    )
);
```

After adding `forced-colors` and applying `SystemColors` keywords, the accent button now uses `Highlight` as a background for its `rest` state. On the `hover` and `active` states, the background and color from the `rest` state are swapped. A double border treatment is applied when in the `focus` state, and the `disabled` has opacity set to 1 and uses the disabled color, `GrayText`, for color on the border and content.

![Accent button forced colors](https://static.fast.design/assets/high-contrast/accent-with-forced-colors.png)

:::note
[forced-color-adjust](https://www.w3.org/TR/css-color-adjust-1/#forced), controls whether the UA system theme color override, should be applied to an element and its descendants. 
The example is set to `none`, because we are overriding to remove the backplate on the text content in the control, that the UA sets on text elements.
:::

### Further resources

**Color contrast comparison chart**

To help determine whether a pair of high contrast colors will meet a color luminosity contrast ratio of at least 10:1, this table uses the high contrast theme color resource names you see in Windows Ease of Access.

How to read this table:
- <mark>YES</mark> - indicates that it is safe to assume this pair of colors will meet high contrast requirements, even in custom themes.
- `YES*` - indicates that this specific pair of colors meets the high contrast requirements in both High Contrast Black and High Contrast White themes.
- NO - indicates that you should never use this pair of colors as they do not meet high contrast requirements in High Contrast Black and High Contrast White themes.

|                                 | Text             | Hyperlink        | Disabled Text    | Selected Text (Foreground) | Selected Text (Background) | Button Text (Foreground) | Button Text (Background) | Background       |
|---------------------------------|------------------|------------------|------------------|----------------------------|----------------------------|--------------------------|--------------------------|------------------|
| **Text**                        | NO               | NO               | NO               | NO                         | NO                         | NO                       | <mark>YES</mark>         | <mark>YES</mark> |
| **Hyperlink**                   | NO               | NO               | NO               | `YES*`                     | NO                         | NO                       | `YES*`                   | <mark>YES</mark> |
| **Disabled Text**               | NO               | NO               | NO               | `YES*`                     | NO                         | NO                       | <mark>YES</mark>         | <mark>YES</mark> |
| **Selected Text (Foreground)**  | NO               | `YES*`           | `YES*  `         | NO                         | <mark>YES</mark>           | `YES*`                   | NO                       | NO               |
| **Selected Text (Background)**  | NO               | NO               | NO               | <mark>YES</mark>           | NO                         | NO                       | `YES*`                   | `YES*`           |
| **Button Text (Foreground)**    | NO               | NO               | NO               | `YES*`                     | NO                         | NO                       | <mark>YES</mark>         | <mark>YES</mark> |
| **Button Text (Background)**    | <mark>YES</mark> | `YES*`           | <mark>YES</mark> | NO                         | `YES*`                     | <mark>YES</mark>         | NO                       | NO               |
| **Background**                  | <mark>YES</mark> | <mark>YES</mark> | <mark>YES</mark> | NO                         | `YES*`                     | <mark>YES</mark>         | NO                       | NO               |



### Microsoft Edge blog

Microsoft Edge blog has excellent and in-depth information on styling for Windows high contrast using forced-colors.
[Styling for Windows high contrast with new standards for forced colors](https://blogs.windows.com/msedgedev/2020/09/17/styling-for-windows-high-contrast-with-new-standards-for-forced-colors/)