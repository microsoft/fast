---
id: file
title: fast-file
sidebar_label: file
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/file/README.md
---

The `fast-file` is a control that is used to give a user the ability to select files from their computer's file system.

## Setup

## Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastFile
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastFile()
    );
```

### Custom Control

```ts
import { File } from "@microsoft/fast-foundation";
import {
    provideFASTDesignSystem,
    fastFile
} from "@microsoft/fast-components";

const controlElementTemplate = html<Avatar>`
    ...your own template that controls file select prompt...
`;

provideFASTDesignSystem()
    .register(
        fastAvatar({
          controlElement: controlElementTemplate,
        })
    );
```

### Custom Control

```ts
import { File } from "@microsoft/fast-foundation";
import {
    provideFASTDesignSystem,
    fastFile
} from "@microsoft/fast-components";

const filtListTemplate = html<Avatar>`
    ...your own template that lists selected files...
`;

provideFASTDesignSystem()
    .register(
        fastAvatar({
          controlElement: fileListTemplate,
        })
    );
```

## Usage
### Basic Usage
```html
<fast-file
  accept="..."
  capture="..."
  value="..."
  files="..."
  multiple>
</fast-file>
```

The `preview` attribute sets the display mode of the `file-list` to display file thumnails.
```html
<fast-file
  preview>
</fast-file>
```

## Create your own design

```ts
import {
    FileOptions,
    File,
    FileTemplate as template,
} from "@microsoft/fast-foundation";
import { fileStyles as styles } from "./my-file.styles";

export const fastFile = File.compose<FileOptions>({
    baseName: "file",
    template,
    styles,
    fileList: fileListTemplate,
    controlElement: controlElementTemplate,
});
```

## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-file)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/file/file.spec.md)
* [Open UI Analysis](https://open-ui.org/components/file.research)