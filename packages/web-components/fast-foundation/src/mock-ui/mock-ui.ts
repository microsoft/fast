import { attr, DOM, FASTElement } from "@microsoft/fast-element";

export class MockUi extends FASTElement {
    private testParams: any;

    public addButton(buttonParams: any): void {
        this.testParams = buttonParams;
    }

    public connectedCallback(): void {
        super.connectedCallback();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }
}
