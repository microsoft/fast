# Slider + Slider-Label

## Overview

The `slider` component allows the user to move one or two `thumb` elements along a vertical or horizontal axis to select a value or range. `slider` is also considered an input field and must work within a `<form>` as other input fields do.

### Background

Just styling `<input type="range"/>` and using `<datalist>` for the tickmarks was considered but the standards aren't supported enough to allow for the level customization we want to provide.

** see [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range)

### Use Cases

- *A customer using the component on a web page.*
On a web page the customer drags the slider from min to max values ultimately setting the value of the component to a value constrained by step and min and max values.

- *A developer building an app with the component and interacting through HTML/CSS/JavaScript.*
A developer can inject labels on the slider into the default slot, if they use <slider-label> elements those will be styled a specific way internally and any part of that style can be overridden. Styles and items intending to be placed in the default slot can be replaced as needed.

- *A designer customizing the component.*
A designer can override any internal styling applied to the slotted labels, the background track, the slider track and the thumb(s) if appropriate.
  
### Features
- Implement your own thumb UI, default provided
- Implement your own background and slider track UI, default provided
- Handle the `slider`'s `onValueChange` callback to be notified when the value has changed.
- Customize the tick marks along the track
- Include slider in form based operations

### Prior Art/Examples
- [FAST-DNA (React)](https://explore.fast.design/components/slider)
- [Material UI](https://material-ui.com/components/slider/)

---

### API

*Component Name*:
- `fast-slider`

*Props/Attrs*
- `min` - minimum allowed value for the slider
- `max` - maximum allowed value for the slider
- `step` - limits the values of the `slider` to increments of the `step` value added to the minimum value of the 
`slider`'s total range.  The default value is 1. The minimum and maximum values of a `slider`'s range are always valid results regardless of the `step` prop. The `step` prop is used as the value for incrementing the thumb by pressing the arrow keys.
 - `value` - Allows authors to specify the initial selected range of the `slider`.  It defaults to a (step constrained) value at the midpoint on the `slider`'s total range. 

*Events*
- `change` - raise the change event for external parties to be informed of the value change.

*Slots*
- `background-track` - the horizontal or vertical track along which the thumb slides
- `thumb` - the control the user drags along the track to change the value of the slider
- `default` slot - Providing child elements to the `fast-slider` will be hosted in the default slot and presented as track labels. See `fast-slider-label` below.

### Anatomy and Appearance
**Structure:**

```html
<div
    part="slider"
    class="slider"
>
  <div part="layout-region" class="layout-region">
      <div part="background-track" class="background-track">
        <slot name="background-track"></slot>
      </div>
      <slot name="track">
        <div part="track" class="track"></div>
      </slot>
      <div part="thumb-container" class="thumb-container" style=${x => x.position}>
          <slot name="thumb"><div class="thumb-cursor"></div></slot>
      </div>
      <slot></slot>
  </div>
</div>
```

## Implementation

```html
<fast-slider
    value="50"
    min="0"
    max="100"
    step="10"
>
    <div slot="thumb"><img src="..."/></div>
    <fast-slider-label
      label="50"
      show-mark="false"
    >
    </fast-slider-label>
</fast-slider>
```

---

### Accessibility

*Slider* implements the recommended keyboard navigation scheme described [W3C aria-practices](http://w3c.github.io/aria-practices/examples/slider/multithumb-slider.html).

- aria-valuenow will be set as the slider value changes
- right and up arrow move the slider in increasing value and left and down arrows move it in decreasing increments
- *Form Input*


### Globalization
Slider should render a mirror view in rtl for example:
![](./images/slider-rtl.png) 

- Strings passed into the component should already be localized

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