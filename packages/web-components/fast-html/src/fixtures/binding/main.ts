import { TemplateElement } from "@microsoft/fast-html";
import { attr, FASTElement } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    @attr
    text: string = "Hello";
}
TestElement.define({
    name: "test-element",
});

class TestElementUnescaped extends FASTElement {
    public html = `<p>Hello world</p>`;
}
TestElementUnescaped.define({
    name: "test-element-unescaped",
});

TemplateElement.define({
    name: "f-template",
});
