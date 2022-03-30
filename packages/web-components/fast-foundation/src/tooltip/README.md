---
id: tooltip
title: fast-tooltip
sidebar_label: tooltip
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/tooltip/README.md
---

The `fast-tooltip` component is used provide extra information about another element when it is hovered.

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastTooltip
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastTooltip()
    );
```

## Usage

```html
<div>
    <fast-button id="anchor">Hover me</fast-button>
    <fast-tooltip anchor="anchor">Tooltip text</fast-tooltip>
</div>
```

## Create your own design

```ts
import { tooltipTemplate as template, Tooltip } from "@microsoft/fast-foundation";
import { tooltipStyles as styles } from "./my-tooltip.styles";

export const myTooltip = Tooltip.compose({
    baseName: "tooltip",
    template,
    styles,
});
```

## API

## `src/tooltip/tooltip.ts`:

### class: `Tooltip`

#### Superclass

| Name                | Module                  | Package |
| ------------------- | ----------------------- | ------- |
| `FoundationElement` | /src/foundation-element |         |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                             | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition<T>     ) => FoundationElementRegistry<T, K>` | FoundationElement |

#### Fields

| Name                      | Privacy | Type                                                                                                                                                                                                                                                                                                                             | Default    | Description                                                                                                                                                                                                                        | Inherited From    |
| ------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `visible`                 | public  | `boolean`                                                                                                                                                                                                                                                                                                                        |            | Whether the tooltip is visible or not.&#xD;&#xA;If undefined tooltip is shown when anchor element is hovered                                                                                                                       |                   |
| `anchor`                  | public  | `string`                                                                                                                                                                                                                                                                                                                         | `""`       | The id of the element the tooltip is anchored to                                                                                                                                                                                   |                   |
| `delay`                   | public  | `number`                                                                                                                                                                                                                                                                                                                         | `300`      | The delay in milliseconds before a tooltip is shown after a hover event                                                                                                                                                            |                   |
| `position`                | public  | `\| TooltipPosition         \| "top"         \| "right"         \| "bottom"         \| "left"         \| "start"         \| "end"         \| "top-left"         \| "top-right"         \| "bottom-left"         \| "bottom-right"         \| "top-start"         \| "top-end"         \| "bottom-start"         \| "bottom-end"` |            | Controls the placement of the tooltip relative to the anchor.&#xD;&#xA;When the position is undefined the tooltip is placed above or below the anchor based on available space.                                                    |                   |
| `autoUpdateMode`          | public  | `AutoUpdateMode`                                                                                                                                                                                                                                                                                                                 | `"anchor"` | Controls when the tooltip updates its position, default is 'anchor' which only updates when&#xD;&#xA;the anchor is resized.  'auto' will update on scroll/resize events.&#xD;&#xA;Corresponds to anchored-region auto-update-mode. |                   |
| `horizontalViewportLock`  | public  | `boolean`                                                                                                                                                                                                                                                                                                                        |            | Controls if the tooltip will always remain fully in the viewport on the horizontal axis                                                                                                                                            |                   |
| `verticalViewportLock`    | public  | `boolean`                                                                                                                                                                                                                                                                                                                        |            | Controls if the tooltip will always remain fully in the viewport on the vertical axis                                                                                                                                              |                   |
| `anchorElement`           | public  | `HTMLElement \| null`                                                                                                                                                                                                                                                                                                            | `null`     | the html element currently being used as anchor.&#xD;&#xA;Setting this directly overrides the anchor attribute.                                                                                                                    |                   |
| `showDelayTimer`          | private | `number \| null`                                                                                                                                                                                                                                                                                                                 | `null`     | The timer that tracks delay time before the tooltip is shown on hover                                                                                                                                                              |                   |
| `hideDelayTimer`          | private | `number \| null`                                                                                                                                                                                                                                                                                                                 | `null`     | The timer that tracks delay time before the tooltip is hidden                                                                                                                                                                      |                   |
| `isAnchorHoveredFocused`  | private | `boolean`                                                                                                                                                                                                                                                                                                                        | `false`    | Indicates whether the anchor is currently being hovered or has focus                                                                                                                                                               |                   |
| `isRegionHovered`         | private | `boolean`                                                                                                                                                                                                                                                                                                                        | `false`    | Indicates whether the region is currently being hovered                                                                                                                                                                            |                   |
| `handleRegionMouseOver`   | private |                                                                                                                                                                                                                                                                                                                                  |            | mouse enters region                                                                                                                                                                                                                |                   |
| `handleRegionMouseOut`    | private |                                                                                                                                                                                                                                                                                                                                  |            | mouse leaves region                                                                                                                                                                                                                |                   |
| `handleAnchorMouseOver`   | private |                                                                                                                                                                                                                                                                                                                                  |            | mouse enters anchor                                                                                                                                                                                                                |                   |
| `handleAnchorMouseOut`    | private |                                                                                                                                                                                                                                                                                                                                  |            | mouse leaves anchor                                                                                                                                                                                                                |                   |
| `handleAnchorFocusIn`     | private |                                                                                                                                                                                                                                                                                                                                  |            | anchor gets focus                                                                                                                                                                                                                  |                   |
| `handleAnchorFocusOut`    | private |                                                                                                                                                                                                                                                                                                                                  |            | anchor loses focus                                                                                                                                                                                                                 |                   |
| `startHideDelayTimer`     | private |                                                                                                                                                                                                                                                                                                                                  |            | starts the hide timer                                                                                                                                                                                                              |                   |
| `clearHideDelayTimer`     | private |                                                                                                                                                                                                                                                                                                                                  |            | clears the hide delay                                                                                                                                                                                                              |                   |
| `startShowDelayTimer`     | private |                                                                                                                                                                                                                                                                                                                                  |            | starts the show timer if not currently running                                                                                                                                                                                     |                   |
| `startHover`              | private |                                                                                                                                                                                                                                                                                                                                  |            | start hover                                                                                                                                                                                                                        |                   |
| `clearShowDelayTimer`     | private |                                                                                                                                                                                                                                                                                                                                  |            | clears the show delay                                                                                                                                                                                                              |                   |
| `getAnchor`               | private |                                                                                                                                                                                                                                                                                                                                  |            | Gets the anchor element by id                                                                                                                                                                                                      |                   |
| `handleDocumentKeydown`   | private |                                                                                                                                                                                                                                                                                                                                  |            | handles key down events to check for dismiss                                                                                                                                                                                       |                   |
| `updateTooltipVisibility` | private |                                                                                                                                                                                                                                                                                                                                  |            | determines whether to show or hide the tooltip based on current state                                                                                                                                                              |                   |
| `showTooltip`             | private |                                                                                                                                                                                                                                                                                                                                  |            | shows the tooltip                                                                                                                                                                                                                  |                   |
| `hideTooltip`             | private |                                                                                                                                                                                                                                                                                                                                  |            | hides the tooltip                                                                                                                                                                                                                  |                   |
| `setRegionProps`          | private |                                                                                                                                                                                                                                                                                                                                  |            | updates the tooltip anchored region props after it has been&#xD;&#xA;added to the DOM                                                                                                                                              |                   |
| `_presentation`           | private | `ComponentPresentation \| null \| undefined`                                                                                                                                                                                                                                                                                     | `void 0`   |                                                                                                                                                                                                                                    | FoundationElement |
| `$presentation`           | public  | `ComponentPresentation \| null`                                                                                                                                                                                                                                                                                                  |            | A property which resolves the ComponentPresentation instance&#xD;&#xA;for the current component.                                                                                                                                   | FoundationElement |
| `template`                | public  | `ElementViewTemplate \| void \| null`                                                                                                                                                                                                                                                                                            |            | Sets the template of the element instance. When undefined,&#xD;&#xA;the element will attempt to resolve the template from&#xD;&#xA;the associated presentation or custom element definition.                                       | FoundationElement |
| `styles`                  | public  | `ElementStyles \| void \| null`                                                                                                                                                                                                                                                                                                  |            | Sets the default styles for the element instance. When undefined,&#xD;&#xA;the element will attempt to resolve default styles from&#xD;&#xA;the associated presentation or custom element definition.                              | FoundationElement |

#### Methods

| Name                     | Privacy   | Description                                                | Parameters                      | Return | Inherited From    |
| ------------------------ | --------- | ---------------------------------------------------------- | ------------------------------- | ------ | ----------------- |
| `visibleChanged`         | private   |                                                            |                                 | `void` |                   |
| `anchorChanged`          | private   |                                                            |                                 | `void` |                   |
| `positionChanged`        | private   |                                                            |                                 | `void` |                   |
| `anchorElementChanged`   | private   |                                                            | `oldValue: HTMLElement \| null` | `void` |                   |
| `viewportElementChanged` | private   |                                                            |                                 | `void` |                   |
| `updateLayout`           | private   | updated the properties being passed to the anchored region |                                 | `void` |                   |
| `templateChanged`        | protected |                                                            |                                 | `void` | FoundationElement |
| `stylesChanged`          | protected |                                                            |                                 | `void` | FoundationElement |

#### Attributes

| Name                       | Field                  | Inherited From |
| -------------------------- | ---------------------- | -------------- |
|                            | visible                |                |
| `anchor`                   | anchor                 |                |
| `delay`                    | delay                  |                |
| `position`                 | position               |                |
| `auto-update-mode`         | autoUpdateMode         |                |
| `horizontal-viewport-lock` | horizontalViewportLock |                |
| `vertical-viewport-lock`   | verticalViewportLock   |                |

<hr/>

### Exports

| Kind | Name              | Declaration     | Module                 | Package |
| ---- | ----------------- | --------------- | ---------------------- | ------- |
| `js` | `TooltipPosition` | TooltipPosition | src/tooltip/tooltip.ts |         |
| `js` | `Tooltip`         | Tooltip         | src/tooltip/tooltip.ts |         |


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-tooltip)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/tooltip/tooltip.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#tooltip)
* [Open UI Analysis](https://open-ui.org/components/tooltip.research)