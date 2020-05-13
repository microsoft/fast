# Usage
```ts
import { customElement } from "@microsoft/fast-element";
import { TextAreaTemplate as template, TextArea } from "@microsoft/fast-foundation";
import { TextAreaStyles as styles } from "./text-area.styles";

@customElement({
    name: "fast-text-area",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTTextArea extends TextArea {}
```