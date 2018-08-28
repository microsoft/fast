# Horizontal overflow
The *horizontal overflow* component accepts items as children. A child can have an optional *slot* property which is either "next" or "previous" which can be used to allow the next/previous click actions. *Horizontal overflow* uses native scrolling behavior.

### Usage guidance
The *horizontal overflow* component always initializes at the start of the overflow content &mdash; left side in LTR and right side in RTL.

## Accessibility
The 'next' and 'previous' buttons are only useful for sighted users, since overflow is a purely visual construct, so they should be hidden from screen readers.