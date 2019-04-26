## Slider label
A component designed to position a label and/or tickmark at a position that correspond to a specific value on a *slider*'s track. By default a *slider label* renders above the *slider*'s front and back bars and below the thumbs.

### Usage
*Slider label* exposes a "position binding" prop which can either be a numerical value that falls within the parent *slider*'s range or a SliderTrackItemAnchor enum value.  

When a *slider label* renders as the child of a *slider* it uses absolute positioning to place itself at a position that corresponds to the value specified by the valuePositionBinding prop on the slider's track.

The available positioning values are as follows:

    selectedRangeMin:The lower value of the *slider*'s currently selected range

    selectedRangeMax: The higher value of the *slider*'s currently selected range

    totalRangeMin: The lower value of the *slider*'s total range.

    totalRangeMax: The higher value of the *slider*'s total range

    constrainedRangeMin: The lower value of the *slider*'s constrained range, defaults to totalRangeMin if no constrained range is set

    constrainedRangeMax: The lower value of the *slider*'s constrained range, defaults to totalRangeMax if no constrained range is set

Note that labels are centered except when the 'totalRangeMax' and 'totalRangeMin' values are used in which case the labels are slightly offset and in horizontal mode are justified to the edge of the *slider* they are aligned with.

label:  the text to display, if any

showTickmark: turns the tick mark associated with the label on/off
