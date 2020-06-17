import { attr, DOM, FASTElement } from "@microsoft/fast-element";
import { keyCodeEscape, keyCodeTab } from "@microsoft/fast-web-utilities";
import tabbable from "tabbable";

export class MockUi extends FASTElement {
   

    public dismiss(): void {
        this.$emit("dismiss");
    }

    public connectedCallback(): void {
        super.connectedCallback();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();

    }
}
