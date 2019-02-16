# FAST Markdown MSFT React

This is a plugin for [markdown-it](https://github.com/markdown-it/markdown-it) and will convert markdown to strings which correspond to MSFT styled React components from the `@microsoft/fast-components-react-msft`.

## Installation

`npm i --save @microsoft/fast-markdown-msft-react`

## Usage

```js
import * as MarkdownIt from "markdown-it";
import FASTMarkdownIt from "@microsoft/fast-markdown-msft-react";

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    xhtmlOut: true
});

md.use(FASTMarkdownIt);

const markdown = "https://microsoft.com";

md.render(markdown);
```
