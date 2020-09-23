---
id: skeleton
title: fluent-skeleton
sidebar_label: skeleton
---

The `fluent-skeleton` component is used as a placeholder for another component that is in a loading state.

## Usage

A URL for an image asset may be passed to the `pattern` attribute. In this mode, the `fluent-skeleton` component is used as a container for a transparent SVG that may express a more complex placeholder

_Example:_
```html live
<fluent-skeleton
    style="
        --neutral-fill-rest: #e1dfdd;
        border-radius: 4px;
        width: 50px;
        height: 50px;
    "
    shape="circle"
></fluent-skeleton>
```

The `shimmer` boolean attribute will activate the component's shimmer effect.

_Example:_
```html live
<fluent-skeleton
    style="
        --neutral-fill-rest: #e1dfdd;
        border-radius: 4px;
        width: 500px;
        height: 250px;
    "
    shape="rect"
    pattern="https://static.fast.design/assets/skeleton-test-pattern.svg"
    shimmer
></fluent-skeleton>
```

An inline SVG can also be inserted into the slot of the `fluent-skeleton`.

_Example:_
```html live
<fluent-skeleton
    style="
        --neutral-fill-rest: #e1dfdd;
        border-radius: 4px;
        width: 500px;
        height: 250px;
    "
    shape="rect"
    shimmer
>
    <svg
        style="position: absolute; left: 0; top: 0;"
        id="pattern"
        width="100%"
        height="100%"
    >
        <defs>
            <mask id="mask" x="0" y="0" width="100%" height="100%">
                <rect x="0" y="0" width="100%" height="100%" fill="#ffffff" />
                <rect x="0" y="0" width="100%" height="45%" rx="4" />
                <rect x="25" y="55%" width="90%" height="15px" rx="4" />
                <rect x="25" y="65%" width="70%" height="15px" rx="4" />
                <rect x="25" y="80%" width="90px" height="30px" rx="4" />
            </mask>
        </defs>
        <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            mask="url(#mask)"
            fill="#ffffff"
        />
    </svg>
  </fluent-skeleton>
</fast-design-system-provider>
```