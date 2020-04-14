## Slider track item

*Slider track items* are components positioned at specific values on a slider's track to provide labels, highlight regions, and add other slider visual decorations.  By default a *slider track item* renders above the *slider*'s front and back bars and below the thumbs.

### Usage
*Slider track item* exposes two "position binding" props which can either be a numerical value that falls within the parent *slider*'s range or a SliderTrackItemAnchor enum value.  

When a *slider track item* renders as the child of a *slider* it uses absolute positioning to place it's "high value" edge (ie. the right edge on a horizontal slider and the top edge on a vertical slider) at a position that corresponds to the value specified by the maxValuePositionBinding prop on the slider's track and opposite edge at a position that corresponds to the maxValuePositionBinding prop.  The edges on the opposite axis should be positioned using css.  Using identical values for both position bindings is acceptable but the component would then have a width or height of zero.

Aside from the positioning logic the *slider track item* is essentially a div.

The available positioning values are as follows:

    selectedRangeMin:The lower value of the *slider*'s currently selected range

    selectedRangeMax: The higher value of the *slider*'s currently selected range

    totalRangeMin: The lower value of the *slider*'s total range

    totalRangeMax: The higher value of the *slider*'s total range

    constrainedRangeMin: The lower value of the *slider*'s constrained range, defaults to totalRangeMin if no constrained range is set
    
    constrainedRangeMax: The lower value of the *slider*'s constrained range, defaults to totalRangeMax if no constrained range is set