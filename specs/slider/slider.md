# slider + slider-label

## Overview

The `slider` component allows the user to move one or two `thumb` elements along a vertical or horizontal axis to select a value or range. `slider` is also considered an input field and must work within a `<form>` as other input fields do.

### Background

Just styling `<input type="range"/>` and using `<datalist>` for the tickmarks was considered but the standards aren't supported enough to allow for the level customization we want to provide.

** see [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range)

### Use Cases

- *A customer using the component on a web page.*
On a web page the customer drags the slider from min to max values ultimately setting the value of the component to a value constrained by step and min and max values.

- *A developer building an app with the component and interacting through HTML/CSS/JavaScript.*
A developer can inject labels on the slider as children, if they use <slider-label> elements those will be styled a specific way internally and the dev can override any part of that style they want. Alternatively the dev can put whatever they want in children and style as they wish.

- *A designer customizing the component.*
A designer can override any internal styling applied to the slotted labels, the background track, the slider track and the thumb(s) if appropriate.
  
### Features
- Implement your own lower and upper thumb UI, default provided
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

*Methods*
- `onValueChanged` - handling the internal framework call when the value attribute is changed.

*Slots*
- `background-track` - background area encompassing the track and labels
- `slider-track` - the horizontal or vertical track along which the thumb slides
- `thumb` - the control the user drags along the track to change the value of the slider

### Anatomy and Appearance
**Structure:**

```
  <div
    role="slider"
  >
    <input type="range" 
      id="${x => x.id}"
      min="${x => x.min}"
      max="${x => x.max}"
      step="${x => x.step}"
      value="${x => x.value}"
    >
    <slot name="label">
      <div>${x => x.label}</div>
    </slot>
    <slot name="background-track">
      <div></div>
    </slot>
    <slot name="slider-track">
      <div></div>
    </slot>
    <slot name="thumb">
      <div></div>
    </slot>
    <slot></slot>
  </div>
```

## Implementation

```
<fast-slider
    id="slider1"
    value={32}
    min={0}
    max={44}
    step={1}
>
    <h2 slot="label"><b>Density</b></h2>
    <div slot="thumb"><img src="..."/></div>
    <fast-slider-label
      label="32"
      show-mark="true"
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

*Consider whether the component has any special globalization needs such as:*

- *Special RTL handling*
Slider should render a mirror view in rtl for example:
![](./images/slider-rtl.png) 

- Strings passed into the component should already be localized

### Test Plan

While testing is still TBD for our web components, I would expect this to align with the testing strategy and not require any additional test support.

---

# Slider label

## Overview

The `slider-label` component provides a default styled label to be placed inside a `slider` component. Users can choose to not show the mark as well as provide custom label content.

### Use Cases

- *A designer customizing the component.*
If they use <slider-label> elements those will be styled a specific way internally and the dev can override any part of that style they want.

### API

*Component Name*
- `slider-label`

*Attributes*
- `show-mark` - boolean to show/hide the mark. Default is show.
- `position` - used to position the label on the track relative to the min and max values

*Slots*
- `mark`

*Parts*
- `label`

### Anatomy and Appearance
**Structure:**

```
  <div>
    ${when(x => x.show-mark, html<slider-label>`
      <slot name="mark"><div>|</div></slot>
    ')}
    <div part="label">
      <slot></slot>
    </div>
  </div>
```

---

## Implementation

```
<fast-slider-label
  show-mark="false"
  position="0"
>
  <svg path="..."></svg>
</fast-slider-label>
```