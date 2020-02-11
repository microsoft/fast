## Toolbar
A generic toolbar component implementing the [toolbar](https://www.w3.org/TR/wai-aria-1.1/#toolbar) role and the keyboard navigation aligning to that role. The *toolbar* will accept any child elements but will only assign focus to children with roles specified in the component's "focusableRoles" prop.

### Usage
To accurately manage document focus, the *toolbar* assumes that only children with the appropriate roles should be focusable. It also expects that these elements are passed as *direct* children. Wrapping all toolbar items inside of a `React.Fragment` (or some other single element) will throw off the internal focus tracking of the *toolbar*. Additionally, the *toolbar* expects that all focusable toolbar children implement the `tabIndex` property and apply that property to the underlying DOM.

The default list of valid roles for toolbar items is as follows:
    "button",
    "checkbox",
    "link",
    "menuitem",
    "menuitemradio",
    "menuitemcheckbox",
    "progressbar",
    "radio",
    "searchbox",
    "slider",
    "spinbutton",
    "switch",
    "textbox",


### Accessibility
The *toolbar* considers a child element focusable when it has a role of that is included in the component's "focusableRoles" prop, and will manage focus between these elements automatically.  