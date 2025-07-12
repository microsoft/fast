import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";
import { attr } from "@microsoft/fast-element";

class TestElement extends RenderableFASTElement {
    @attr
    text: string = "Hello";
}
TestElement.defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

class TestElementUnescaped extends RenderableFASTElement {
    public html = `<p>Hello world</p>`;
}
TestElementUnescaped.defineAsync({
    name: "test-element-unescaped",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({
    name: "f-template",
});
