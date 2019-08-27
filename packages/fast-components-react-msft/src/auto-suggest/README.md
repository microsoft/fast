# Auto suggest

Presents suggestions in a list as the user types in the field.

## Accessibility

Implements the recommended [listbox](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox) keyboard navigation scheme.

## Style

The input region can be customized using the `inputRegion` render prop.

## Implementing

The *auto suggest* component can be thought of as having two parts:
- the "input region" portion of the component, basically a text input box.
- the "menu" portion which consists of a *listbox* which displays the list of suggested options.

The expected usage pattern of the component is for authors to watch the "onValueChange" event to detect text changes in the component and to use that to determine how to update the children (typically *auto-suggest-option*) of the component.  The "onInvoked" event indicates that the user made a choice.  The "item" parameter of the "onInvoked" event will be the props of the invoked child if the user invoked a list item directly (vs. hitting return on the input box itself).
