## Select option
A component designed to work as a child of the *select* component.

### Usage
The component required "id" prop must be unique and is applied as an id to to the resulting element in the dom.  Developers should not examine *select-option* components to determine their selected state, but rather hook up to the "onSelectedItemsChanged" callback on the parent select component.

### Accessibility
The *select-option* component generates an html element with role="option" as well as "aria-selected" and "aria-disabled" attributes. 