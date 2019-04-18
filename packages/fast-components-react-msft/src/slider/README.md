# Slider
The *slider* component allows the user to move one or two "thumb" elements along a vertical or horizontal axis to select a value or range. It is very similar in usage to the html input "range" element.

### Usage
As the user moves the slider the resulting value changes can be used by developers in two ways:
- If the *slider* component is part of a form the results will be submitted along with the form. This is because the *slider* component maintains a hidden native HTML input element in the dom and updates the "value" attribute of the native component as selection changes.
- Developers can hook up to the *select*'s onValueChange callback.

Child components of the slider (labels, tick marks, highlighted bar regions) can use the *slider*'s constext to position themselves appropriately on the *slider*'s track and react to state changes.  The *slider track item* component is an example of this and can be used as a building block to create styled elements that position themselves on the slider track.

A *slider* can be oriented vertically or horizontally with the "orientation" prop.  Horizontal is the default

The slider component can be set to different modes using the "mode" prop.  The default is "singleValue".  The modes are as follows:
- "singleValue":  A single thumb, no selected range is displayed.
- "adjustUpperValue":  A single thumb associated with the upper value of slider's selected range.  The *slider*'s front bar element displays and is anchored to the low end of the slider's current range as the user adjusts the maximum value.
- "adjustLowerValue":  A single thumb associated with the lower value of slider's selected range.  The *slider*'s front bar element displays and is anchored to the high end of the slider's current range as the user adjusts the minimum value.
- "adjustBoth":  Two thumbs allow users to adjust both ends of the *slider*'s range.

The default range of the component is 0-100.  Inverted ranges, where the minimum value is numerically greater than the maximum value, are not supported.

The constrained range prop allows authors to limit values to a subsection of the *slider*'s total range.

The "initialValue" prop allows authors to specify the initial selected range of the *slider*.  It defaults to a (step constrained) value at the midpoint on the *slider*'s total range for all modes except "adjustBoth" in which case the selected range starts at 40% to 60% of the total range.

The "step" prop limits the values of the *slider* to incrments of the *step* value added to the minimum value of the *slider*'s total range.  The default value is 1. The minimum and maximum values of a *slider*'s range are always valid results regardless of the "step" prop. The "step" prop is used as the value for incrementing the thumb by pressing the arrow keys, if the step value is 0 the value used for incrementing is determined by dividing the total range by the pixel width of the slider.

The "pageStep" prop specifies the amount the slider increments when the page up/down keys are pressed.  It is undefined by default.  The increment set for "pageStep" has no effect on constraining values, the slider will stil land on increments of the "step" prop regardless of what "pageStep" is set to.

The "value" prop is used for controlled mode.

The "thumb" prop allows authors to provide custom render functions for the thumb element(s).

### Accessibility
*Slider* component thumbs can be moved with the arrow keys and expose a number of aria attributes for accessibility - "aria-valuemin", "aria-valuemax", "aria-valuenow" and "aria-labelledby" (associated with the slider's "labelledby" prop).