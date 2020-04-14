# Action trigger

## Accessibility

Renders as a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) element, or an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) if the `href` prop is set.

When using a glyph only, provide a `title` prop to add a tooltip so there is a secondary means for identifying the functionality.

Provide an [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) prop if you need more context for assistive technologies.

## Style

The required `glyph` prop takes a function that returns a ReactNode to render the glyph (ie. a [render prop](https://reactjs.org/docs/render-props.html)). This function should accept a string parameter that is applied as a `className` to the top level element of the resulting node.
