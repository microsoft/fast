---
id: localization
title: Localization
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/versioned_docs/version-legacy/design/localization.md
description: FAST provides several mechanisms to apply direction-based styles.
keywords:
    - localization
---
## Document Direction
Many CSS layout properties like [flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox) and [CSS grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout) automatically handle reflow depending on the [document's primary direction](https://www.w3.org/International/questions/qa-html-dir). There are also CSS [logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties/Basic_concepts) that can be used as well to apply localized margins, paddings, borders and positioning. Unfortunately, browser support for these properties is limited and there are still styling cases not covered by these properties (directional glyphs, transforms, etc). That is why FAST provides several mechanisms to apply direction-based styles.

### `direction` DesignToken 
`@microsoft/fast-components ` export [`direction`](../api/fast-components.md.direction) (a [DesignToken](../api/fast-foundation.md.designtoken)) that can be used to configure the primary direction of the document.

### DirectionalStyleSheetBehavior
[`DirectionalStyleSheetBehavior`](../api/fast-components.md.directionalstylesheetbehavior) can be used to apply arbitrary LTR and RTL stylesheets, depending on the nearest [`FASTDesignSystemProvider`s direction](../api/fast-components.md.fastdesignsystemprovider) property.

**Example: Using `DirectionalStyleSheetBehavior`**
```ts
import { css } from "@microsoft/fast-element";
import { DirectionalStyleSheetBehavior } from "@microsoft/fast-components";

const ltr = css`
    :host {
        left: 20px;
    }
`;

const rtl = css`
    :host {
        right: 20px;
    }
`;

const styles = css`
    .host {
        position: relative
    }
`.withBehaviors(new DirectionalStyleSheetBehavior(ltr, rtl))
```
