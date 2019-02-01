## Listbox item
A component designed to work as a child of the *listbox*.

### Usage
The component required '"id"' prop must be unique and is applied as an id to to the resulting element in the dom.  Developers should not examine *listbox-item* components to determine their selected state, but rather hook up to the '"onSelectedItemsChanged"' callback on the parent listbox.

### Accessibility
The *listbox-item* generates an html element with role="option" as well as "aria-selected" and "aria-disabled" attributes. 