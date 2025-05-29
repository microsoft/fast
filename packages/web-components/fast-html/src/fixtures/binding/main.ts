import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { attr } from "@microsoft/fast-element";

class TestElement extends RenderableFASTElement {
    @attr
    text: string = "Hello";
}
TestElement.define({
    name: "test-element",
    shadowOptions: null,
});

class TestElementUnescaped extends RenderableFASTElement {
    public html = `<p>Hello world</p>`;
}
TestElementUnescaped.define({
    name: "test-element-unescaped",
    shadowOptions: null,
});

TemplateElement.define({
    name: "f-template",
});
