import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { attr, FASTElement } from "@microsoft/fast-element";

class TestElement extends FASTElement {
    @attr
    text: string = "Hello";
}
RenderableFASTElement(TestElement).defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

class TestElementUnescaped extends FASTElement {
    public html = `<p>Hello world</p>`;
}
RenderableFASTElement(TestElementUnescaped).defineAsync({
    name: "test-element-unescaped",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({
    name: "f-template",
});
