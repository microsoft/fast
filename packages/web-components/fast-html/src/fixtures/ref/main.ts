import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";

class TestElement extends RenderableFASTElement {
    public video: HTMLVideoElement | null = null;
}
TestElement.define({
    name: "test-element",
    shadowOptions: null,
});

TemplateElement.define({
    name: "f-template",
});
