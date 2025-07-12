import { RenderableFASTElement, TemplateElement } from "@microsoft/fast-html";

class TestElement extends RenderableFASTElement {
    public video: HTMLVideoElement | null = null;
}
TestElement.defineAsync({
    name: "test-element",
    templateOptions: "defer-and-hydrate",
});

TemplateElement.define({
    name: "f-template",
});
