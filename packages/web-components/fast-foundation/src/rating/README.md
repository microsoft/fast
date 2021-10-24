---
id: rating
title: fast-rating
sidebar_label: rating
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/rating/README.md
---

The `fast-rating` component is used provide 

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastRating
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastRating()
    );
```

## Usage

```html
<fast-rating></fast-rating>
```

## Create your own design

```ts
import { ratingTemplate as template, Rating} from "@microsoft/fast-foundation";
import { ratingStyles as styles } from "./my-rating.styles";

export const myRating = Rating.compose({
    baseName: "rating",
    template,
    styles,
});
```

## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-rating)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/rating/rating.spec.md)