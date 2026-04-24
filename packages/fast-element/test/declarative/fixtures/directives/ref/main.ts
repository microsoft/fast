import { FASTElement } from "@microsoft/fast-element";
import {
    declarativeTemplate,
    TemplateElement,
} from "@microsoft/fast-element/declarative.js";

class TestElement extends FASTElement {
    public video: HTMLVideoElement | null = null;
}
TestElement.define({
    name: "test-element",
    template: declarativeTemplate(),
});

TemplateElement.config({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
});
