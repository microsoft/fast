import { FASTElement } from "@microsoft/fast-element";
import { attr } from "@microsoft/fast-element/attr.js";
import { TemplateElement } from "@microsoft/fast-element/declarative.js";

class TestElement extends FASTElement {
    @attr
    text: string = "Hello";
}
TestElement.define({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

class TestElementUnescaped extends FASTElement {
    public html = `<p>Hello world</p>`;
}
TestElementUnescaped.define({
    name: "test-element-unescaped",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.config({
    hydrationComplete() {
        (window as any).hydrationCompleted = true;
    },
}).define({
    name: "f-template",
});
