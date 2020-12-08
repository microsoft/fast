---
id: high-contrast-document
title: High Contrast Document
sidebar_label: High Contrast Document
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/design-systems/high-contrast.md
---

### High Contrast styling in FAST components using forced-colors.
High contrast mode uses the CSS media feature, 'forced-colors'. When forced-colors is set to active, the user agent will apply a limited color palette to the component.

**Example:**
```css
@media (forced-colors: active) {
    :host {
        background: ButtonFace;
    }
}
```

FAST has a utility function that is use to construct the forced-colors in the stylesheet, called [forcedColorsStylesheetBehavior](fast/match-media-stylesheet-behavior.ts). This is set in the `withBehavior()` function inside the css style.

**Example**
```css
export const ComponentStyles = css`
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

### System Color Keyword
In `forced-colors` mode, the colors on the component are reduced to a limited color pallete chosen by the user. The system color keyword exposes these user chosen colors.

Below are the system colors keywords used in FAST. The keywords are used as color values on style properties.


| Keyword         | Description                                                                       |
|-----------------|-----------------------------------------------------------------------------------|
| Canvas          | Background of application content or documents.                                   |
| CanvasText      | Text in application content or documents.                                         |
| LinkText        | Text in non-active, non-visited links. For light backgrounds, traditionally blue. |
| VisitedText     | Text in visited links. For light backgrounds, traditionally purple.               |
| ActiveText      | Text in active links. For light backgrounds, traditionally red.                   |
| ButtonFace      | The face background color for push buttons.                                       |
| ButtonText      | Text on push buttons.                                                             |
| ButtonBorder    | The base border color for push buttons.                                           |
| Field           | Background of input fields.                                                       |
| FieldText       | Text in input fields.                                                             |
| Highlight       | Background of selected items/text.                                                |
| HighlightText   | Text of selected items/text.                                                      |
| GrayText        | Disabled text. (Often, but not necessarily, gray.)                                |


When setting the color value keyword in the stylesheet, FAST uses the [SystemColor](fast/system-colors.ts) enum.

**Example**
```css
export const ComponentStyles = css`
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

### Suggestions
When style for high contrast, here are some suggested must-dos and try.

- Make sure all elements are opaque. In default mode, disabled is usually styled with opacity. But in high contrast, the elements are at full opacity with the color value of `GrayText`.
- Before you add multiple high contrast styles, it is best to try only adding `forced-color-adjust: auto`. This will let the user agent automatically adjust the element's color. Then start overriding the styles on the elements that `forced-colors` did not adjust.
```css
	:host {
	     forced-color-adjust: auto;
 }
```

### Windows High Contrast Themes
`forced-colors` works with Windows high contrast, in the Ease of Access settings. There are two default themes to test high contrast, `High Contrast Black` and `High Contrast White`.

Here is a 1:1 map between the `forced-colors` keywords and Windows high contrast resource names.

| forced-colors   | Windows        |
|-----------------|----------------|
| Canvas          | Background     |
| CanvasText      | Text           |
| LinkText        | Hyperlinks     |
| ButtonText      | Button Text    |
| HighlightText   | Selected Text  |
| GrayText        | Disabled Text  |


## Further resources

**Color contrast comparison chart**

To help determine whether a pair of high contrast colors will meet a color luminosity contrast ratio of at least 10:1
This table uses the high contrast theme color resource names you see in Windows Ease of Access.

How to read this table:
- **YES** indicates that it is safe to assume this pair of colors will meet high contrast requirements, even in custom themes
- **YES*** indicates that this specific pair of colors meets the high contrast requirements in both “HC White” and “HC Black” themes.
- **NO** indicates that you should never use this pair of colors as they do not meet high contrast requirements in “HC White” and “HC Black” themes.

|                                 | Text | Hyperlink | Disabled Text | Selected Text (Foreground) | Selected Text (Background) | Button Text (Foreground) | Button Text (Background) | Background |
|---------------------------------|------|-----------|---------------|----------------------------|----------------------------|--------------------------|--------------------------|------------|
| **Text**                        | NO   | NO        | NO            | NO                         | NO                         | NO                       | YES                      | YES        |
| **Hyperlink**                   | NO   | NO        | NO            | YES*                       | NO                         | NO                       | YES*                     | YES        |
| **Disabled Text**               | NO   | NO        | NO            | YES*                       | NO                         | NO                       | YES                      | YES        |
| **Selected Text (Foreground)**  | NO   | YES*      | YES*          | NO                         | YES                        | YES*                     | NO                       | NO         |
| **Selected Text (Background)**  | NO   | NO        | NO            | YES                        | NO                         | NO                       | YES*                     | YES*       |
| **Button Text (Foreground)**    | NO   | NO        | NO            | YES*                       | NO                         | NO                       | YES                      | YES        |
| **Button Text (Background)**    | YES  | YES*      | YES           | NO                         | YES*                       | YES                      | NO                       | NO         |
| **Background**                  | YES  | YES       | YES           | NO                         | YES*                       | YES                      | NO                       | NO         |

