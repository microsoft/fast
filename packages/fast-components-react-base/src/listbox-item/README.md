## Listbox item
A component designed to work as a child of the *listbox*.

### Usage
All listbox items should have a itemId unique to the scope of the listbox.  If no itemId is provided the item is identified by its value.  If multiple list items could share the same value authors should provide itemId's or unexpected behavior may occur.

Note: The "id" prop is being depracated, please use "itemId" instead.  Authors who have some need for the item's html "id" attribute to be populated should continue to do so, but will need to provide an itemId as well in a future update.  

Developers should not examine *listbox-item* components to determine their selected state, but rather hook up to the "onSelectedItemsChanged" callback on the parent listbox.

### Accessibility
The *listbox-item* generates an html element with role="option" as well as "aria-selected" and "aria-disabled" attributes. 