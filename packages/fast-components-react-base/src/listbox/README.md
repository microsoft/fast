## Listbox
A generic menu component implementing the [listbox](https://www.w3.org/TR/wai-aria-1.1/#listbox) role and the keyboard navigation aligning to that role. The *listbox* will accept any child elements but only children with role of `"option"` will receive focus.

### Usage
To manage document focus the *listbox* assumes that all rendered children that have the role `"option"` and not decorated with "aria-disabled" are focusable html elements. It also expects that these elements are passed as *direct* children. Wrapping all menu items inside of a `React.Fragment` (or some other single element) will throw off the internal focus tracking of the *listbox*. Additionally, the *listbox* expects that all menu item children implement the `tabIndex` property and apply that property to the underlying DOM.

The *listbox* "typeAheadPropName" prop indicates which prop the *listbox* examines on children to manage focus when text entry is used to control focus.  The referenced property must be a string.

### Accessibility
The *listbox* considers a child element focusable when it has a role of `"option"` and will manage focus between these elements automatically. 