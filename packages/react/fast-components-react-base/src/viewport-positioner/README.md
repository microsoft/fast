## Viewport positioner

The *viewport positioner* component is a container that positions itself relative to an anchor element while trying to take maximum advantage of the space available in the viewport.  For example it could enable a menu to open above or below a control depending on the size and scroll positon of the viewport.

### Usage

The *viewport positioner* and the anchor element it is attached to must both be children of the specified viewport element. There should also be no other scrollable elements in the DOM hierarchy between these elements and the viewport.  The *viewport positioner* element will have its position attribute programmatically set to "relative" and the component also writes in values for the top, right, bottom, left, transform-origin and tranform attributes. 

If no "anchor" is specified the component will be disabled and not attempt to adjust layout. If no viewport is specified the component will assume the viewport is the root document element of the page.

Authors can specify a positioning mode for each axis or leave it "uncontrolled" and use other means (i.e. their own css) to manage the positioner's layout on that axis.  The "adjacent" positioning mode ensures that the positioner does not overlap with the anchor on that axis and butts up against the outer edges of the anchor element.  With the "inset" positioning mode set the positioner will overlap with the anchor on the axis specified but will only extend beyond the anchor on the side with the most available space.

Adjacent:

Anchor
       |Positioner

 or

             Anchor
 Positioner|

Inset:

 Anchor
 |Positioner

 or 

      Anchor
 Positioner|
 
 If a default position is specified for a particular axis and there is enough space that position will be set.  Whether there is enough space is determined by comparing the threshold size for the axis (or the height/width of the positioner if no threshold specified) to the available space for that position. If there is not enough space, or if no default position is specified, the positioner chooses the position with the most available space.

 The "verticalLockToDefault" and "horizontalLockToDefault" properties force placement to specified default positions regardless of available space.  Note that this has no effect when an axis is in "uncontrolled" mode.

The chosen position determines which side of the positioner is fixed to the anchor.  For example if the chosen position for the horizontal axis is "left" the positioner will have its "right" property set to a value corresponding to the left edge of the anchor and the "left" propertly will be unset.

The *viewport positioner* adds css classes to itself based on the chosen positions (i.e. "viewportPositioner__left", "viewportPositioner__right", etc.) to enable authors to style the positioner and its contents based on relative position.

The "AlwaysInView" props (i.e. "horizontalAlwaysInView" and "verticalAlwaysInView") for each axis allows authors to specify whether the positioner should remain on screen when the anchor element is scrolled off.  The *viewport positioner* accomplishes this by setting the translate transform and translate origin properties of the component.

The "fixedAfterInitialPlacement" prop is set the component will not adjust positioning after the initial render.

When the "delayContentInstanciation" prop is true the child of the positioner will not be rendered until the component has been positioned relative to its anchor.  This may be useful in cases where the browser auto scrolls to bring a focused child into view before it has been positioned, for example.  Default is false. This flag may be removed in a future version and become the default behavior.

Authors should be mindful that instanciating a flyout positioner can cause layout changes as it is actually inserted into the DOM and can cause parent containers to expand, move siblings down the page, etc.  It is up to authors to place the component such that it does not cause unwanted layout changes.    

The not fully supported [ResizeObserver](https://developers.google.com/web/updates/2016/10/resizeobserver) and [IntersectionObserver](https://developers.google.com/web/updates/2016/04/intersectionobserver) are used (supported in Chrome), so it is necessary to apply a polyfill if more thorough browser support is needed (Safari and Firefox). Full adaptation is expected soon.




