---
id: skeleton
title: skeleton
sidebar_label: skeleton
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/skeleton/README.md
---

The `skeleton` component is used as a placeholder for another component that is in a loading state.

## Usage

A URL for an image asset may be passed to the `pattern` attribute. In this mode, the `fast-skeleton` component is used as a container for a transparent SVG that may express a more complex placeholder

_Example:_
```html live
<fast-skeleton
    style="
        --neutral-fill-rest: #e1dfdd;
        border-radius: 4px;
        width: 50px;
        height: 50px;
    "
    shape="circle"
></fast-skeleton>
```

The `shimmer` boolean attribute will activate the component's shimmer effect.

_Example:_
```html live
<fast-skeleton
    style="
        --neutral-fill-rest: #e1dfdd;
        border-radius: 4px;
        width: 500px;
        height: 250px;
    "
    shape="rect"
    pattern="https://static.fast.design/assets/skeleton-test-pattern.svg"
    shimmer
></fast-skeleton>
```

An inline SVG can also be inserted into the slot of the `fast-skeleton`.

_Example:_
```html live
<fast-skeleton
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
  </fast-skeleton>
</fast-design-system-provider>
```

## Customization



| CSS Variable                  | Expected value  |
|-------------------------------|-----------------|
|`--skeleton-fill`              | Color           |
|`--skeleton-animation-fill`    | Color           |
|`--skeleton-animation-gradient`| Linear gradient |
|`--skeleton-animation-timing`  | Easing function |
