# Breadcrumb

## Overview
A `fast-breadcrumb` component is used as a navigational aid, allowing users to maintain awareness of their locations within a program, app, or a website.

### Use Cases
- James is browsing an ecommerce website and is looking for a few items to add to his new kitchen. He needs a knife set, and an espresso machine. He checks out `Home and Kitchen` page, then selects `Kitchen and Dining`, first category he picks is `Cutlery`, he finds the sets of knives. There is now a breadcrumb trail of the pages James has clicked through. `Home and Kitchen /  Kitchen and Dining / Cutlery / Knife Sets`
He clicks on `Kitchen and Dining` to go back to the category of kitchen items, selects `Coffee and Espresso` finds the best one that suits his needs. If James wants to continue looking for another item for his kitchen, or other things for his home, he just needs to click on any of the links in the breadcrumb trail to continue his search.

### Prior Art/Examples
- [Ant Design](https://ant.design/components/breadcrumb/)
- [Atlaskit](https://atlaskit.atlassian.com/packages/core/breadcrumbs)
- [Carbon Design](https://www.carbondesignsystem.com/components/breadcrumb/code/)
- [FAST Breadcrumb (React)](https://www.npmjs.com/package/@microsoft/fast-components-react-msft)
- [Lightning Design System](https://www.lightningdesignsystem.com/components/breadcrumbs/#site-main-content)
- [Material UI](https://material-ui.com/components/breadcrumbs/)
- [Office Fabric](https://developer.microsoft.com/en-us/fluentui#/controls/web/breadcrumb)

---

### API

*Component Name*
- `fast-breadcrumb`

### Anatomy and Appearance

```ts
<template
    role="navigation"
    aria-label="breadcrumb"
>
    <div role="list">
        <slot></slot>
    </div>
</template>
```

*Slot Names*
- default slot for items

---

## Implementation

```html
<fast-breadcrumb>
    <fast-breadcrumb-item>
        <fast-anchor appearance="lightweight">Home</fast-anchor>
    </fast-breadcrumb-item>
    <fast-breadcrumb-item>
        <fast-anchor appearance="lightweight">Templates</fast-anchor>
    </fast-breadcrumb-item>
    <fast-breadcrumb-item aria-current="page">
        <fast-anchor appearance="lightweight">Template Prices</fast-anchor>
    </fast-breadcrumb-item>
</fast-breadcrumb>
```

### Accessibility

The breadcrumb should align to the interaction model provided by the [W3C](https://www.w3.org/TR/wai-aria-practices/#breadcrumb)

### Globalization

The first and last element inside the breadcrumb will be reversed when switching in LTR/RTL.

### Test Plan

While testing is still TBD for our web components, I would expect this to align with the testing strategy and not require any additional test support.



# Breadcrumb Item

## Overview

The `fast-breadcrumb-item` is placed inside the `fast-breadcrumb` component. It provides a default slot to implement any element, and also contains the separator.

### API

*Component Name*
- `fast-breadcrumb-item`

*Slots*
- default slot for element
- `separator` - used as part of the visual presentation that signifies the breadcrumb trail. The separator is defaulted to a `/`, but authors can override to use an `svg`.

*CSS Parts*
- `separator` - there is a style to adjust margin and another to hide the separator when a breadrumb item is set to `aria-current="page"`

### Anatomy and Appearance

```ts
<div
    role="listitem"
    class="content"
    part="content"
    tabindex="0"
    aria-current="${x => x.ariaCurrent}"
>
    <slot></slot>
    <span
        class="separator ${x => (x.ariaCurrent ? "hide" : "")}
        part="separator"
        aria-hidden="true"
    >
        <slot name="separator">${x => x.separator}</slot>
    </span>
</div>
```

## Implementation

```html
<fast-breadcrumb-item>
    <fast-anchor appearance="lightweight">Home</fast-anchor>
</fast-breadcrumb-item>
```

*Overriding separator*

```html
<fast-breadcrumb-item>
    <fast-anchor appearance="lightweight">Home</fast-anchor>
    <span slot="separator">
        <svg>
            <path .../>
        </svg>
    </span>
</fast-breadcrumb-item>
```
