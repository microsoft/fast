## Toolbar item group
The *toolbar item group* component is used to create visual subgroups within a *toolbar* but keep the children of the group as part of the toolbar's linear focus queue.  

### Usage
- The "itemPath" prop of the *toolbar item group* is automatically set by the parent toolbar and authors should no set it directly.

- The managed classes "toolbarItemGroup__horizontal" and "toolbarItemGroup__vertical" indicate the orientation of the parent toolbar and enable authors to style nested *toolbar item groups* accordingly.

### Accessibility
 The *toolbar item group* component's focusable children participates keyboard navigation queue of the parent [toolbar](https://www.w3.org/TR/wai-aria-1.1/#toolbar).
