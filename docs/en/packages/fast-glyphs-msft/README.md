---
id: index
title: FAST Glyphs Msft
sidebar_label: Glyphs Msft
---

# Glyphs MSFT

This is a distribution of Microsoft glyphs which are exported as strings.

Example:

```ts
export const exampleGlyph = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M25.2,16h3V30H2.2V4h14V7l7-7,9,9Zm-21,0h10V6H4.2Zm10,2H4.2V28h10Zm2-7v5h5Zm0,7V28h10V18Zm.47-9,6.53,6.54L29.73,9,23.2,2.46Z"/></svg>';
```

They can be embedded into webpages via a build process or for example in React using [dangerouslySetInnerHTML](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml).

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
