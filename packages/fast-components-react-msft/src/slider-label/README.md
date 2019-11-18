## Slider label
*Slider labels* are styled label versions of base *Slider track item* components positioned at specific values on a slider's track to act as labels.  By default a *slider label* renders above the *slider*'s track visual and below the thumbs.

### Usage
*Slider label* exposes a "position binding" prop which can either be a numerical value that falls within the parent *slider*'s range or a `SliderTrackItemAnchor` enum value.  

When a *slider label* renders as the child of a *slider* it uses absolute positioning to place itself at a position that corresponds to the value specified by the `maxValuePositionBinding` prop on the slider's track. 

The available positioning values are as follows:

    `selectedRangeMin`:The lower value of the *slider*'s currently selected range

    `selectedRangeMax`: The higher value of the *slider*'s currently selected range

    `totalRangeMin`: The lower value of the *slider*'s total range

    `totalRangeMax`: The higher value of the *slider*'s total range

    `constrainedRangeMin`: The lower value of the *slider*'s constrained range, defaults to totalRangeMin if no constrained range is set
    
    `constrainedRangeMax`: The lower value of the *slider*'s constrained range, defaults to totalRangeMax if no constrained range is set

Labels positioned at `totalRangeMin` are left justified and at `totalRangeMax` are right justified such that label strings grow into the slider area, other labels are centered.  Authors should ensure labels do not collide with each other.