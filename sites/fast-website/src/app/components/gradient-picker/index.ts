import { attr, customElement, FASTElement } from "@microsoft/fast-element";

@customElement("gradient-picker")
export class GradientPicker extends FASTElement {
    @attr greeting: string = "Hello";

    greetingChanged(): void {
        this.shadowRoot!.innerHTML = this.greeting;
    }
}
