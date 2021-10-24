# Rating

## Overview

The Rating component is used to provide feedback from a user's opinion on a particular product or experience.

### Use Cases

Carl has purchased a coffee machine online and he wants to share his opinion about the machine with others. In addition to writing a review, Carl also rates the product by giving it a rating of 4 out of 5 stars.

### Non-goals



### Prior Art/Examples

-   [Office Fabric](https://developer.microsoft.com/en-us/fluentui#/controls/web/rating)
-   [Ant Design](https://ant.design/components/rate/)
-   [Atlassian](https://atlaskit.atlassian.com/packages/design-system/rating)
-   [Windows (UWP)](https://docs.microsoft.com/en-us/windows/apps/design/controls/rating)

---

### API

_Component name:_

-   `fast-rating`

_Attributes:_

-   `max` - The maximum amount of items rendered
-   `disabled` - Unabled to interact with the component
-   `value` - The current value of the item selected
-   `initial-value` - The default value of items selected 
-   `readonly` - A boolean to remove interaction on the component
-   `label` - A string value that counts the amount of ratings
-   `step`
-   `mode` - an enum that has a 'single' or 'multiple' rating type system.


_Properties:_

_Slots:_

-   `default` - Default slot is the label used to count the amount of ratings provided by the users

_Events_



_Functions_



### Anatomy and Appearance

_Template:_

```
<template>
    <slot></slot>
    <slot name="label"></slot>
</template>
```

## Implementation

```
<fast-rating></fast-rating>
```

### Accessibility

Keyboard interaction

- Tab and Shift + Tab will move focus in and out of the rating component. When focus moves onto the rating component, the first item is higlighted and selected.
- Right and Down Arrow will move focus to the next rating item in the group. As focused is moved to the next item, both the focused item and the previous item are visually hilighted, but the the focused item is only selected.
- Left and Up Arrow will move focus to the previous radio button in the group, removing the visual highlight from the previously focused item.


Assistive Technology

### Dependencies
