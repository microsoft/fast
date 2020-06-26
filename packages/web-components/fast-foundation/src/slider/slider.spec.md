# Slider + Slider-Label

## Overview

The `slider` component allows the user to move one or two `thumb` elements along a vertical or horizontal axis to select a value or range. `slider` is also considered an input field and must work within a `<form>` as other input fields do.

### Background

There is a standard input for sliders, `<input type="range"/>`, but it doesn't support the full level of detail, styling, etc that most design systems need or require. For this reason a hidden input is created to support form input operations but not visible. For context please see [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range) and [caniuse](https://caniuse.com/#search=datalist).

### Use Cases

- *A customer using the component on a web page.*
On a web page the customer drags the slider from min to max values ultimately setting the value of the component to a value constrained by step and min and max values.

- *A developer building an app with the component and interacting through HTML/CSS/JavaScript.*
A developer can inject labels on the slider into the default slot, if they use `slider-label` elements those will be styled a specific way internally and any part of that style can be overridden. Styles and items intending to be placed in the default slot can be replaced as needed.

- *A designer customizing the component.*
A designer can override any internal styling applied to the slotted labels, the track, the progress track and the thumb(s) if appropriate.
  
### Features
- Implement your own thumb UI, default provided
- Implement your own slider track and progress track UI, default provided
- Handle the `slider`'s `change` callback to be notified when the value has changed.
- Customize the tick marks along the track
- Include slider in form based operations
- Utilize `mode` attribute to allow the slider to operate in different configurations, `single-value`, `range`, `adjust-from-lower` and `adjust-from-upper`.
**proposing that for the initial spec we start with supporting `single-value` only.*

### Prior Art/Examples
- [FAST (React)](https://explore.fast.design/components/slider)
- [Material UI](https://material-ui.com/components/slider/)
- [Atlassian UI](https://atlaskit.atlassian.com/packages/core/range)
- [Lightning Design System](https://www.lightningdesignsystem.com/components/slider/)
- [ANT](https://ant.design/components/slider/)
---

### API

*Component Name*:
- `fast-slider`

*Attributes:*
- `min` - minimum allowed value for the slider
- `max` - maximum allowed value for the slider
- `step` - limits the values of the `slider` to increments of the `step` value added to the minimum value of the 
`slider`'s total range.  The default value is 1. The minimum and maximum values of a `slider`'s range are always valid results regardless of the `step` prop. The `step` prop is used as the value for incrementing the thumb by pressing the arrow keys.
 - `value` - Allows authors to specify the initial selected range of the `slider`.  It defaults to a (step constrained) value at the midpoint on the `slider`'s total range. In `range` mode `value` is expected to be a 2 element array where the lower value is the first value and upper value is the second.
 - `orientation` - horizontal or vertical values allowed.
 - `mode` - `single-value` | `range` | `adjust-from-upper` | `adjust-from-lower`. `adjust-from-upper` and `adjust-from-lower` are special single value modes where a progress indicator is shown on the right or left of the thumb respectively. `range` mode produces a lower and upper thumb that can be adjusted independently producing a progress indicator (foreground-track) in between the two thumbs.

*Events*
- `change` - raise the change event for external parties to be informed of the `slider`'s value change.

*Slots*
- `track` - the `horizontal` or `vertical` track along which the thumb slides
- `progress-track` - the progress indicator for `range`, `adjust-from-upper` and `adjust-from-lower` modes.
- `thumb` - the control the user drags along the track to change the value of the slider
- `lower-thumb` - same as `thumb` except used only in `range` mode.
- `upper-thumb` - same as `thumb` except used only in `range` mode.
- `default` slot - Providing child elements to the `fast-slider` will be hosted in the default slot and presented as track labels. See `fast-slider-label` below.

### Anatomy and Appearance
**Structure:**

```html
  <template
    role="slider"
  >
    <div
          part="slider"
          class="slider"
    >
      <div part="layout-region" class="layout-region">
          <div part="track-container" class="track">
            <slot name="track"></slot>
          </div>
          <div part="progress-track" class="progress-track">
            <slot name="progress-track"></slot>
          </div>
          <div part="thumb-container" class="thumb-container">
              <slot name="thumb"><div class="thumb-cursor"></div></slot>
          </div>
          <div part="lower-thumb-container" class="lower-thumb-container">
              <slot name="lower-thumb"><div class="lower-thumb-cursor"></div></slot>
          </div>
          <div part="upper-thumb-container" class="upper-thumb-container">
              <slot name="upper-thumb"><div class="upper-thumb-cursor"></div></slot>
          </div>
          <slot></slot>
      </div>
    </div>
  </template>
```

## Implementation

```html
<fast-slider
    value="50"
    min="0"
    max="100"
    step="10"
>
    <div slot="thumb"><svg path="..."/></div>
    <fast-slider-label
      label="50"
      show-mark="false"
    >
    </fast-slider-label>
</fast-slider>
```

---

### Accessibility

*Slider* are RTL compliant and support the following aria best practices for sliders [W3C aria-practices](https://www.w3.org/TR/wai-aria-practices-1.1/#slider)

### Test Plan

While testing is still TBD for our web components, I would expect this to align with the testing strategy and not require any additional test support.

---

# Slider Label

## Overview

The `slider-label` component provides a default styled label to be placed inside a `slider` component. Users can choose to hide the mark as well as provide custom label content.

### Use Cases

- *A designer customizing the component.*
If they use <slider-label> elements those will be styled a specific way internally and the dev can override any part of that style they want.

### API

*Component Name*
- `slider-label`

*Attributes*
- `hide-mark` - boolean to show/hide the mark. Default is false.
- `position` - used to position the label at the corresponding value on the track

*Slots*
- `label` - replace the label with your dom

*Parts*
- `label` - style the label shown under the mark

### Anatomy and Appearance
**Structure:**

```html
<div
    part="slider-label"
    class="slider-label"
    style=${x => x.positionStyle}
>
    <div class="slider-label-container">
        ${when(
            x => bool(x.hideMark),
            html`
            <div class="mark">
            </div>    
        `
        )}
        <div class="label-positioner">
            <slot name="label">
                <span part="label" class="label"}>
                    ${x => x.label}
                </span>
            </slot>
        </div>
    </div>
</div>
```

---

## Implementation

```html
<fast-slider-label
  hide-mark="true"
  position="0"
>
  <svg path="..."></svg>
</fast-slider-label>
```