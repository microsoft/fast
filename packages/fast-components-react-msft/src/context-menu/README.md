# Context menu

A menu of actions that trigger an action or navigation.

## Accessibility

Follows the [`menu`](https://www.w3.org/TR/wai-aria-1.1/#menu) role 

It considers a child element focusable when it has a role of `menuitem`, `menuitemradio`, or `menuitemcheckbox` and will manage focus between these elements automatically.

## Implementing

Will accept any child elements, but is built to work with *context menu item* and *divider*.
