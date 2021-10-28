# Rating

## Overview

The Rating component is used to provide feedback from a user's opinion on a particular product or experience.

### Use Cases

Scenario 1
Carl has purchased a coffee machine online and he wants to share his opinion about the machine with others. In addition to writing a review, Carl also rates the product by giving it a rating of 4 out of 5 stars.

Scenario 2
Wendy just finished her companies survey. At the end of the survey, she is asked to rate how she felt about the experience. She is given a collection of emojis to choose from about how she felt.

### Prior Art/Examples

- [Office Fabric](https://developer.microsoft.com/en-us/fluentui#/controls/web/rating)
- [Ant Design](https://ant.design/components/rate/)
- [Atlassian](https://atlaskit.atlassian.com/packages/design-system/rating)
- [Windows (UWP)](https://docs.microsoft.com/en-us/windows/apps/design/controls/rating)

---

### API

Extends [RadioGroup](../radio-group/radio-group.spec.md).

_Component name:_

- `fast-rating`

_Attributes:_

- `disabled` - A boolean to remove interaction with the component.
- `readonly` - A boolean to remove interaction with the component.
- `value` - The current value of the item selected.
- `mode` - enum
  - multiple: This is the default mode. A mode where multiple items are highlighted for rating.
  - single: A mode where the a user chooses only one item to rate.

_Slots:_

- `default` - Default slot is the slotted items.
- `label` - Optional label. Some examples would be to indicate rating counts, or average ratings.

### Anatomy and Appearance

The Rating component template is extended from RadioGroup.

_Template:_

```html
<template
    role="radiogroup"
    aria-disabled="${x => x.disabled}"
    aria-readonly="${x => x.readOnly}"
    @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
    @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
    @focusout="${(x, c) => x.focusOutHandler(c.event as FocusEvent)}"
    @mouseout="${(x, c) => x.onMouseout(c.event as MouseEvent)}"
>
    <div
        class="positioning-region ${x =>
            x.orientation === Orientation.horizontal ? "horizontal" : "vertical"}"
        part="positioning-region"
    >
        <slot
            ${slotted({
                property: "slottedRadioButtons",
                filter: elements("[role=radio]"),
            })}
        ></slot>
    </div>
    <slot name="label"></slot>
</template>
```

## Implementation

```html
<fast-rating>
    <fast-rating-item value="1"></fast-rating-item>
    <fast-rating-item value="2"></fast-rating-item>
    <fast-rating-item value="3"></fast-rating-item>
    <fast-rating-item value="4"></fast-rating-item>
    <fast-rating-item value="5"></fast-rating-item>
</fast-rating>
```

### Accessibility

Keyboard interaction

- Tab and Shift + Tab will move focus in and out of the rating component. When focus moves onto the rating component, the first item is higlighted and selected.
- Right and Down Arrow will move focus to the next rating item in the group. As focused is moved to the next item, both the focused item and the previous item are visually hilighted, but the the focused item is only selected.
- Left and Up Arrow will move focus to the previous radio button in the group, removing the visual highlight from the previously focused item.


Assistive Technology

- When focused is on the component, the reader will announce the component, the current item and the the total amount of items. Example: "rating, 1 of 5 stars".
As focused is moved to the next item, the reader will read out the current value and the amount of total items. Example: "2 of 5 stars, 3 of 5 stars, 4 of 5 stars, 5 of 5 stars".



# Rating item

## Overview
The `fast-rating-item` is to used inside the `fast-rating` component.

### API

Extends [Radio](../radio/radio.spec.md).

_Component name:_

- `fast-rating-item`

_Attributes:_

- `disabled` - A boolean to remove interaction on the item.
- `readonly` - A boolean to remove interaction on the item.

_Slots:_

- `unchecked-icon` - The element that is visible when the rating item is unchecked.
- `checked-icon` - The element that is visible when the rating item is checked.

### Anatomy and Appearance

The Rating item template is extended from Radio.

_Template:_

```html
<template
        role="radio"
        class="${x => (x.checked ? "checked" : "")} ${x =>
            x.readOnly ? "readonly" : ""}"
        aria-checked="${x => x.checked}"
        aria-required="${x => x.required}"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
        @keypress="${(x, c) => x.keypressHandler(c.event as KeyboardEvent)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
    >
        <div class="rating-icons" part="rating-icons">
            <slot name="unchecked-icon" part="unchecked-icon" aria-hidden="true">
                ${definition.uncheckedIcon || ""}
            </slot>
            <slot name="checked-icon" part="checked-icon" aria-hidden="true">
                ${definition.checkedIcon || ""}
            </slot>
        </div>
    </template>
```

## Implementation

```html
<fast-rating-item value="1"></fast-rating-item>
```
