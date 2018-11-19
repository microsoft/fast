## Context menu
A generic menu component implementing the [menu](https://www.w3.org/TR/wai-aria-1.1/#menu) role and the keyboard navigation aligning to that role. The *context menu* will accept any child elements but is built to work with *context menu item* and *divider* components.

### Usage
To accurately manage document focus, the *context menu* assumes that all rendered children are either an element with a role of `"menuitem"`, `"menuitemradio"`, `"menuitemcheckbox"`, or `"separator"` (an `hr` element is also acceptable). It also expects that these elements are passed as *direct* children. Wrapping all menu items inside of a `React.Fragment` (or some other single element) will throw off the internal focus tracking of the *context menu*. Additionally, the *context menu* expects that all menu item children implement the `tabIndex` property and apply that property to the underlying DOM.

### Accessibility
The *context menu* considers a child element focusable when it has a role of `"menuitem"`, `"menuitemradio"`, or `"menuitemcheckbox"`, and will manage focus between these elements automatically. 