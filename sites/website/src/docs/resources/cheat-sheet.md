---
id: cheat-sheet
title: Cheat Sheet
sidebar_label: Cheat Sheet
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/resources/cheat-sheet.md
---
## Setup

To register all available components:

```ts
import { 
    allComponents, 
    provideFASTDesignSystem 
} from "@microsoft/fast-components";

provideFASTDesignSystem().register(allComponents);
```

To register custom components:

```ts
import { 
    fastButton, 
    provideFASTDesignSystem 
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastButton() // desired custom component
    );
```

Visit our [Getting Started Guide](https://www.fast.design/docs/components/getting-started) for more details, Tips, and Notes.