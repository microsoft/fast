## Stack Panel

The *stack panel* component is a container that enables smooth scrolling and virtualization of child elements arranged horizontally or vertically.

### Usage

Virtualization:  When virtualization is enabled the component does not render child items that are not in the viewport or within the defined buffer zone (ie one or more items outside the viewport).

Smooth scrolling: When smooth scrolling is enabled the component monitors focus changes in child elements and will scroll the element that gains focus into view.  Note that virtualized elements can't get focus so typically authors will want at least one out of view item instanciated otherwise it will not be possible to tab outside of the viewport.