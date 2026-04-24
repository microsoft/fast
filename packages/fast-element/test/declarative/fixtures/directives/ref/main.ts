import { FASTElement } from "@microsoft/fast-element";
import { TemplateElement } from "@microsoft/fast-element/declarative.js";

class TestElement extends FASTElement {
    public video: HTMLVideoElement | null = null;
}
TestElement.define({
    name: "test-element",
});

TemplateElement.config({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
}).define({
    name: "f-template",
});
