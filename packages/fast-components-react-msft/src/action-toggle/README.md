# Action Toggle

*Action toggle* should be used as a control on or around an interactive region of the page that affects the region or items within the region. It usually represents a switch between one of two states.

## Usage

Use *action toggle* for specific control around a functional state. Labeling can be done using a glyph and text, but could also contain just a glyph or just text. Make sure the text and glyph represent the expected function. When only a glyph is used to label the button other elements, such as a tooltip, may be required to make the toggle's function clear.

The "selectedGlyph" and "unselectedGlyph" props take a function that returns a ReactNode to render the glyph (ie. a [render prop](https://reactjs.org/docs/render-props.html)).  Note that the function should accept a string parameter that is applied as a class name to the top level element of the resulting node.  This class name will be populated by the *action toggle* component to use an internally generated class ("actionToggle_selectedGlyph" & "actionToggle_unselectedGlyph") to apply to the glyphs for styling. 

## Style guidance

Multiple related *action toggle* controls should be grouped visually to reinforce their associated functionality. Place the toggle where it is not hidden or obscured in the clutter of the page.

## Accessibility

The *action toggle* utilizes the text found in the "selectedLabel" and "unselectedLabel" properties to populate an aria-label with the toggled state. The aria-label is important when the *action toggle* is configured as glyph-only. Otherwise, a non-sighted user would not get the context of the toggle change. If a more verbose description is needed, a tooltip is an option to provide additional context.