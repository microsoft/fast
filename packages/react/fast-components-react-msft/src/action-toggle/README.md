# Action toggle

## Accessibility

When using a glyph only, provide a `title` prop to add a tooltip so there is a secondary means for identifying the functionality.

The values provided in the `selectedLabel` and `unselectedLabel` props sets the [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) attribute for assistive technologies.

## Style

The `selectedGlyph` and `unselectedGlyph` props takes a function that returns a ReactNode to render the glyphs (ie. a [render prop](https://reactjs.org/docs/render-props.html)). This function should accept a string parameter that is applied as a `className` to the top level element of the resulting node.
