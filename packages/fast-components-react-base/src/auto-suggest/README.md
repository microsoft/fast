## Auto suggest
The *auto suggest* component presents suggestions in a list as the user types in a search box.

### Usage
The *auto suggest* component can be thought of as having two parts:
- the "input region" portion of the component, basically a text input box.
- the "menu" portion which consists of a *listbox* which displays the list of suggested options.

The expected usage pattern of the component is for authors to watch the "onValueChange" event to detect text changes in the component and to use that to determine how to update the children (typically based on *listbox-item*) of the component.  The "onInvoked" event indicates that the user made a choice.  The "item" parameter of the "onInvoked" event will be the props of the invoked child if the user invoked a list item directly (vs. hitting return on the input box itself.

The input region of the component can be customized using the component's "inputRegion" render prop.

### Accessibility
*Auto suggest* implements the recommended keyboard navigation scheme described [here](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox) for interacting with the listbox.
