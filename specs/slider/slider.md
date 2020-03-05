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
- Implement your own lower and upper thumb UI, default provided.
- Implement your own background and slider track UI, default provided.
- Developers can hook up to the `slider`'s `onValueChange` callback to be notified when the value has changed.
- Customize the tick marks along the track.
- Form association, if the `slider` component is part of a form the results will be submitted along with the form.

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
- `mode`
The slider component can be set to different modes using the `mode` prop.  The default is `singleValue`.  The modes are as follows:
 > - `singleValue` -  A single thumb, no selected range is displayed.
 > - `adjustUpperValue` -  A single thumb associated with the upper value of slider's selected range.  The *slider*'s front bar element displays and is anchored to the low end of the slider's current range as the user adjusts the maximum value.
 > - `adjustLowerValue` -  A single thumb associated with the lower value of slider's selected range.  The *slider*'s front bar element displays and is anchored to the high end of the slider's current range as the user adjusts the minimum value.
 > - `adjustBoth` - in which case the selected range starts at 40% to 60% of the total range

 - `initialValue` - The `initialValue` prop allows authors to specify the initial selected range of the `slider`.  It defaults to a (step constrained) value at the midpoint on the `slider`'s total range for all modes except `adjustBoth`.

The aria values by default will be the min, max and value number but can be overridden via these props
- `aria-valuemin` -
- `aria-valuemax` - 
- `aria-valuenow` - 

*Events*
- `onValueChange`

*Slots*
- `backgroundTrack`
- `foregroundTrack`
- `sliderTrack`
- `lowerThumb`
- `upperThumb`


### Anatomy and Appearance
**Structure:**

```
  <div
    role="slider"
    $aria-valuenow="${x => x.aria-valuenow}"
    $aria-valuemin="${x => x.aria-valuemin}"
    $aria-valuemax="${x => x.aria-valuemax}"
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
    <slot name="backgroundTrack">
      <div></div>
    </slot>
    <slot name="sliderTrack">
      <div></div>
    </slot>
    <slot name="sliderForegroundTrack">
      <div></div>
    </slot>
    <slot name="lowerThumb">
      <div></div>
    </slot>
    <slot name="upperThumb">
      <div></div>
    </slot>
    <slot></slot>
  </div>
```

## Implementation

```
<fast-slider
    id="slider1"
    initialValue={32}
    ariaminvalue={"0"}
    ariamaxvalue={"40"}
    ariavaluenow="32"}
    min={0}
    max={44}
    step={1}
>
    <h2 slot="label"><b>Density</b></h2>
    <fast-slider-label
      label="32"
      showTickMark="true"
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

The `slider-label` component provides a default styled label to be placed inside a `slider` component. Users can choose to not show the tickmark as well as provide custom label content.

### Use Cases

- *A designer customizing the component.*
If they use <slider-label> elements those will be styled a specific way internally and the dev can override any part of that style they want.

### API

*Component Name*
- `slider-label`

*Attributes*
- `showTickmark` - boolean to show/hide the tick mark. Default is show.
- `valuePosition` - used to position the label on the track relative to the min and max values

*Slots*
- `tickmark`

*Parts*
- `label`

### Anatomy and Appearance
**Structure:**

```
  <div>
    ${when(x => x.showTickMark, html<slider-label>`
      <slot name="tickmark"><div>|</div></slot>
    ')}
    <div part="label">
      <slot></slot>
    </div>
  </div>
```

---

## Implementation

<fast-slider-label
  showTickMark="false"
  valuePosition="0"
>
  <svg path="..."></svg>
</fast-slider-label>
