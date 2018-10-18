## Context menu
A generic menu component implementing the [menu](https://www.w3.org/TR/wai-aria-1.1/#menu) role and the keyboard navigation aligning to that role. The *context-menu* will accept any child elements but is built to work with *context-menu-item* and *divider* components.

## Accessibility
The *context-menu* considers a child element focusable when it has a role of `"menuitem"`, `"menuitemradio"`, or `"menuitemcheckbox"`, and will manage focus between these elements automatically. 