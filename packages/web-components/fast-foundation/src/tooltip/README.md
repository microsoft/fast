---
id: tooltip
title: fast-tooltip
sidebar_label: tooltip
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/tooltip/README.md
---

The `fast-tooltip` component is used provide extra information about another element when it is hovered.

## Usage

```html live
function ShowTooltip(props) {
  useEffect(() => {
    const testTooltip= document.getElementById("testtip");
    testTooltip.anchorElement = document.getElementById("testbutton");
  });
  return (
    <fast-design-system-provider use-defaults>
      <div>
          <fast-button id="testbutton">
              Hover me for more info
          </fast-button>
          <fast-tooltip id="testtip" position="right">
              helpful text
          </fast-tooltip>
      </div>
    </fast-design-system-provider>
  );
}
```
---

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Tooltip, TooltipTemplate as template } from "@microsoft/fast-foundation";
import { TooltipStyles as styles } from "./tooltip.styles";

@customElement({
    name: "fast-tooltip",
    template,
    styles,
})
export class FASTTooltip extends Tooltip {}
```