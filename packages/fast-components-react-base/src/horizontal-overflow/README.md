# Horizontal overflow
The *horizontal overflow* component accepts items as children. A child can have an optional *slot* property which is either "next" or "previous" which can be used to allow the next/previous click actions. *Horizontal overflow* uses native scrolling behavior.

### Usage guidance
The *horizontal overflow* component always initializes at the start of the overflow content &mdash; left side in LTR and right side in RTL. Several callbacks are supplied to provide the consumer with overflow and scroll data. The not fully supported [ResizeObserver](https://developers.google.com/web/updates/2016/10/resizeobserver) is used (supported in Chrome), so it is necessary to apply a polyfill if more thorough browser support is needed (Safari and Firefox). Full adaptation is expected soon.

The "onOverflowChange" callback is provided to enable developers to react to changes in overflow.  The returned "OverflowChange" object describes overflow as follows:
 - When both "overflowStart" and "overflowEnd" are `false`, there is no overflow
 - When both are `true`, there is overflow on either side
 - 'overflowStart' is `true` when there are items to the left in LTR (right in RTL)
 - 'overflowEnd' is `true` when there are items to the right in LTR (left in RTL)

 The "onScrollChange" callback is deprecated and should be avoided, use "onOverflowChange" instead.

 The "scrollDuration" prop enables authors to specify a custom duration for scroll animations in milliseconds.  Default is 500ms.

 The "nextItemPeek" prop defines how many pixels of the next or previous item is partially visible when the component scrolls content.  The default value is 50 pixels.  The component only provides this peek if there is enough room to accommodate the currently focused item. 

## Accessibility
The 'next' and 'previous' buttons are only useful for sighted users, since overflow is a purely visual construct, so they should be hidden from screen readers.