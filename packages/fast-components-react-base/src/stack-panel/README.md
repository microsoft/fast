## Stack Panel

NOTE: this component is in initial development and should not yet be considered stable.

The *stack panel* component is a container that enables smooth scrolling and virtualization of child elements arranged horizontally or vertically.

### Usage

Virtualization:  When virtualization is enabled the component does not render child items that are not in the viewport or within the defined buffer zone (ie one or more items outside the viewport).

Smooth scrolling: When smooth scrolling is enabled the component monitors focus changes in child elements and will scroll the element that gains focus into view.  Note that virtualized elements can't get focus so typically authors will want at least one out of view item instanciated otherwise it will not be possible to tab outside of the viewport.

Authors should be aware that this component writes to the width/left or top/height css style attributes of children on render depending on the orientation of the stack panel.

### Props

 enableVirtualization:  Whether child elements are virtualized or not. Defaults to true.

 neverVirtualizeIndexes: Authors can provide an array of indexes which flag child indexes that should not be virtualized.  For example providing [0, 10] to this prop would mean that child items at indexes 0 and 10 would be rendered.

 defaultItemSpan:  The default span of the child items in pixels, this can be overriden on an item by item basis using the "itemSpanOverrides" prop. Default is 100. 

 itemSpanOverrides: An object where the keys correspond to child indexes and the values to the span to be used to calculate layout for the child at that index. For example {1:200, 5:500} would specify that the child item at index 1 has a span of 200 pixels and the one at index 5 has a span of 500 pixels.

preloadBufferLength: How many out of view child items to render on either side of the viewport. Default is 1.

orientation: Whether the child elements stack vertically or horizontally.  Default is vertical.

onScrollChange:  Callback for when the component scrolls.

nextItemPeek:  When the component scrolls focused content into view how many pixels should the next item "peek" into view.  Note that the component will clip the peek value applied based on available viewport size.  Default is 50.

enableSmoothScrolling:  Whether smooth scrolling is enabled or not.  When disabled focused items will be brought into view by the browser (ie. not animated).  Default is true.

scrollDuration: The lenght of the scroll animation in milliseconds.  Default is 500.

initiallyVisibleItemIndex:  When provided the component will initially render with the child at that index scrolled into view.  After the component is initialzed if this value is changed 



