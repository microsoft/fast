import { attr, FASTElement } from "@microsoft/fast-element";
import {
    declarativeTemplate,
    TemplateElement,
} from "@microsoft/fast-element/declarative.js";

class TestElement extends FASTElement {
    @attr
    text: string = "Hello";
}
TestElement.define({
    name: "test-element",
    template: declarativeTemplate(),
});

class TestElementUnescaped extends FASTElement {
    public html = `<p>Hello world</p>`;
}
TestElementUnescaped.define({
    name: "test-element-unescaped",
    template: declarativeTemplate(),
});

TemplateElement.config({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
});
