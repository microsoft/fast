# FAST Microsoft SVG Glyphs
This is a distribution of Microsoft glyphs which are exported as strings and can be embedded in webpages.

## Installation
`npm i --save @microsoft/fast-glyphs-msft`

## Usage
```js
import { glyphBuildingblocks } from "@microsoft/fast-glyphs-msft";

const container = document.createElement("div");
container.innerHTML = glyphBuildingblocks;
document.body.appendChild(container);
```

## Current available glyphs
- glyphBuildingblocks
- glyphExamples
- glyphGlobalnavbutton
- glyphPage
