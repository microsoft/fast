import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { enableHydration, whenHydrated } from "@microsoft/fast-element/hydration.js";

class TestElement extends FASTElement {
    public video: HTMLVideoElement | null = null;
}
TestElement.define({
    name: "test-element",
    template: declarativeTemplate(),
});

enableHydration();
void whenHydrated.then(() => {
    (window as any).hydrationCompleted = true;
});
