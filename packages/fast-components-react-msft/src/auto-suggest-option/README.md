## Auto suggest option
A component designed to work as a child of the *auto-suggest* component.

### Usage
An *auto-suggest-option* should have a itemId unique to the scope of the parent *auto-suggest*.  If no itemId is provided the option is identified by its value.  If multiple options could share the same value authors should provide itemId's or unexpected behavior may occur.

Note: The "id" prop is being depracated, please use "itemId" instead.  Authors who have some need for the item's html "id" attribute to be populated should continue to do so, but will need to provide an itemId as well in a future update.

### Accessibility
The *auto-suggest-option* component generates an html element with role="option" as well as "aria-selected" and "aria-disabled" attributes. 