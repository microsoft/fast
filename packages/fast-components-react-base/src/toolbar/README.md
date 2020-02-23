## Toolbar

The toolbar manages the tab indexes of its direct children such that only one is a tab stop at any particular time and moving focus within the toolbar is accomplished with the up/down or left/right arrow keys based on whether the *toolbar's* orientation is horizontal or vertical.  Nested groups of child elements can be created using the associated *toolbar item group* component and focusable elements within these groups will be added to the toolbar's master focus queue. *Toolbar item groups* can be nested, focusable items in nested groups are added to the toolbar's master queue.

The order of focusable items is determined by their order in the dom.

The "initialFocusIndex" prop enables authors to set which item in the toolbar will get focus when the *toolbar* first gets tab focus.  For items at the root level of the toolbar this can be expressed simply as the index of the child item (note: non-focusable items count in this calculation), for toolbar items nested in *toolbar item groups* the "initialFocusIndex" should passed in as an array corresponding to the indexes of the group in each parent.  This is useful in order to "reset" the focus of a toolbar if its children are being changed.

For example:
        <Toolbar initialFocusIndex={[3, 0]}>
            <Button>Item 1</Button>
            <button>Item 2</button>
            <div>Something not focusable</div>
            <ToolbarItemGroup>
                <button>Initial Focus Here!</button>
                <button>Item 5</button>
            </ToolbarItemGroup>
        </Toolbar>

Additionally, if the "initialFocusIndex" prop is changed while focus is outside of the toolbar a focusable item at that index will will get focus the next time the toolbar is tabbed to. 


### Usage
- As the component manages tab indexes of child elements authors should not attempt to set this attribute directly.

- The component uses the [Tabbable](https://www.npmjs.com/package/tabbable) package to determine whether a particular child is focusable or not.
.
- Authors should consider providing keys to toolbar items esp if items get added or removed.

- The "toolbar__horizontal" and "toolbar__vertical" managed classes can be used to style toolbars of different orientation.

### Accessibility
 A generic *toolbar* component implementing the [toolbar](https://www.w3.org/TR/wai-aria-1.1/#toolbar) role and the keyboard navigation aligning to that role. 