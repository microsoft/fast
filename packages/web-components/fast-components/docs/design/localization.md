---
id: localization
title: Localization
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-components/docs/design/localization.md
---

## Document Direction
Many CSS layout properties like [flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox) and [CSS grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout) automatically handle reflow depending on the [document's primary direction](https://www.w3.org/International/questions/qa-html-dir). There are also CSS [logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties/Basic_concepts) that can be used as well to apply localized margins, paddings, borders and positioning. Unfortunately, browser support for these properties is limited and there are still styling cases not covered by these properties (directional glyphs, transforms, etc). That is why FAST provides several mechanisms to apply direction-based styles.

### DesignSystemProvider
The [`FASTDesignSystemProvider`](/docs/api/fast-components.fastdesignsystemprovider/) exposes a `direction` property. This should be set to the primary document direction and defaults to `ltr`. This value will be used to inform the stylesheet behaviors described below.

### `inlineStartBehavior` and `inlineEndBehavior`
[inlineStartBehavior](/docs/api/fast-components.inlinestartbehavior/) and [inlineEndBehavior](/docs/api/fast-components.inlineendbehavior/) can be used to apply localized [float](https://developer.mozilla.org/en-US/docs/Web/CSS/float) properties. These are drop-in replacements for the browsers `inline-start` and `inline-end` float values and should be used when the native values are not supported. If your browser-matrix supports `inline-start` and `inline-end` float values, please use the native values.

**Example: Using `inlineStartBehavior` and `inlineEndBehavior`**
```ts
import { css } from "@microsoft/fast-element";
import { inlineStartBehavior } from "@microsoft/fast-components";

const styles = css`
    :host {
        float: ${inlineStartBehavior.var}
    }
`.withBehaviors(inlineStartBehavior)
```

### DirectionalStyleSheetBehavior
[`DirectionalStyleSheetBehavior`](/docs/api/fast-foundation.directionalstylesheetbehavior/) can be used to apply arbitrary LTR and RTL stylesheets, depending on the nearest [`FASTDesignSystemProvider`s direction](/docs/api/fast-components.fastdesignsystemprovider.direction/) property.

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
