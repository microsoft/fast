# Horizontal overflow
The *horizontal overflow* component accepts items as children. A child can have an optional *slot* property which is either "next" or "previous" which can be used to allow the next/previous click actions. *Horizontal overflow* uses native scrolling behavior.

### Usage guidance
The *horizontal overflow* component always initializes at the start of the overflow content &mdash; left side in LTR and right side in RTL. Several callbacks are supplied to provide the consumer with overflow and scroll data. The not fully supported [ResizeObserver](https://developers.google.com/web/updates/2016/10/resizeobserver) is used (supported in Chrome), so it is necessary to apply a polyfill if more thorough browser support is needed (Safari and Firefox). Full adaptation is expected soon.

## Accessibility
The 'next' and 'previous' buttons are only useful for sighted users, since overflow is a purely visual construct, so they should be hidden from screen readers.